import os
import sys
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

import jwt
import requests
from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

try:
    from flask_socketio import SocketIO
except ImportError:
    SocketIO = None

PROJECT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_DIR / "backend" / ".env")
sys.path.insert(0, str(PROJECT_DIR / "src"))
from prediction import predict_attrition

FEATURES = ("Age", "JobLevel", "JobSatisfaction", "EnvironmentSatisfaction", "JobInvolvement", "MonthlyIncome", "OverTime", "WorkLifeBalance", "YearsAtCompany", "YearsInCurrentRole", "YearsWithCurrManager", "JobRole")
HR_DEMO = [("HR001", "Priya Sharma", "priya@demo.hr"), ("HR002", "Rahul Kumar", "rahul@demo.hr"), ("HR003", "Ananya Reddy", "ananya@demo.hr")]


def now():
    return datetime.now(timezone.utc)


def error(message, status):
    return jsonify({"status": "error", "message": message}), status


def serialize(value):
    if isinstance(value, ObjectId): return str(value)
    if isinstance(value, datetime): return value.isoformat()
    if isinstance(value, dict): return {key: serialize(item) for key, item in value.items() if key != "_id" and key != "password_hash"}
    if isinstance(value, list): return [serialize(item) for item in value]
    return value


def employee_public(employee):
    return {"employee_id": employee["employee_id"], "name": employee["name"], "email": employee["email"], "whatsapp_number": employee.get("whatsapp_number", ""), "created_at": serialize(employee.get("created_at"))}


def auth_required(role=None):
    def decorator(function):
        @wraps(function)
        def wrapped(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "): return error("Authentication required", 401)
            try: payload = jwt.decode(header[7:], app.config["JWT_SECRET"], algorithms=["HS256"])
            except jwt.PyJWTError: return error("Invalid or expired authentication token", 401)
            if role and payload.get("role") != role: return error("You are not authorized for this resource", 403)
            request.auth = payload
            return function(*args, **kwargs)
        return wrapped
    return decorator


def token(role, subject):
    return jwt.encode({"sub": subject, "role": role, "exp": now() + timedelta(hours=12)}, app.config["JWT_SECRET"], algorithm="HS256")


def validate_features(features):
    if not isinstance(features, dict): return "features must be an object"
    missing = [field for field in FEATURES if field not in features]
    if missing: return f"Missing ML features: {', '.join(missing)}"
    numeric = ("Age", "JobLevel", "JobSatisfaction", "EnvironmentSatisfaction", "JobInvolvement", "MonthlyIncome", "WorkLifeBalance", "YearsAtCompany", "YearsInCurrentRole", "YearsWithCurrManager")
    if any(not isinstance(features[field], (int, float)) or isinstance(features[field], bool) for field in numeric): return "Numeric ML features must be numbers"
    if features["OverTime"] not in ("Yes", "No") or not str(features["JobRole"]).strip(): return "OverTime or JobRole is invalid"
    return None


def status_view(assessment, employee):
    review = (assessment or {}).get("review", {})
    return {"employee_id": employee["employee_id"], "name": employee["name"], "email": employee["email"], "whatsapp_number": employee.get("whatsapp_number", ""), "selected_hr_id": (assessment or {}).get("selected_hr_id"), "selected_hr_name": (assessment or {}).get("selected_hr_name"), "submission_status": (assessment or {}).get("submission_status", "Not Submitted"), "review_status": (assessment or {}).get("review_status", "Pending"), "decision": review.get("decision"), "notification_status": (assessment or {}).get("notification_status")}


def hr_view(assessment, employee):
    result = serialize(assessment)
    result["employee"] = employee_public(employee)
    result["employee_id"] = employee["employee_id"]
    return result


def whatsapp(employee, message):
    if not app.config["WHATSAPP_ACCESS_TOKEN"] or not app.config["WHATSAPP_PHONE_NUMBER_ID"]: return "pending", "WhatsApp credentials are not configured"
    phone_number = "".join(character for character in str(employee.get("whatsapp_number", "")) if character.isdigit())
    if len(phone_number) == 10:
        phone_number = f"91{phone_number}"
    if len(phone_number) < 11:
        return "failed", "Employee WhatsApp number is not a valid international number"
    phone_number = f"+{phone_number}"
    try:
        result = requests.post(f"https://graph.facebook.com/{app.config['WHATSAPP_API_VERSION']}/{app.config['WHATSAPP_PHONE_NUMBER_ID']}/messages", headers={"Authorization": f"Bearer {app.config['WHATSAPP_ACCESS_TOKEN']}", "Content-Type": "application/json"}, json={"messaging_product": "whatsapp", "to": phone_number, "type": "text", "text": {"body": message}}, timeout=15)
        if result.ok:
            try:
                provider_response = result.json()
                message_id = provider_response.get("messages", [{}])[0].get("id")
            except (ValueError, IndexError, AttributeError):
                provider_response = {}
                message_id = None
            if not message_id:
                return "failed", f"WhatsApp provider returned HTTP {result.status_code} without a message ID"
            return "accepted", {"http_status": result.status_code, "message_id": message_id, "provider_response": provider_response}
        try:
            provider_error = result.json().get("error", {}).get("message")
        except ValueError:
            provider_error = None
        return "failed", f"WhatsApp provider returned HTTP {result.status_code}: {provider_error or 'No provider error details'}"
    except requests.RequestException: return "failed", "WhatsApp provider request failed"


app = Flask(__name__)
app.config["JWT_SECRET"] = os.getenv("JWT_SECRET")
if not app.config["JWT_SECRET"]:
    raise RuntimeError("JWT_SECRET environment variable is required before starting the backend")
app.config["WHATSAPP_ACCESS_TOKEN"] = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
app.config["WHATSAPP_PHONE_NUMBER_ID"] = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
app.config["WHATSAPP_API_VERSION"] = os.getenv("WHATSAPP_API_VERSION", "v20.0")
origins = [item.strip() for item in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",") if item.strip()]
CORS(app, origins=origins, supports_credentials=False)
socketio = SocketIO(app, cors_allowed_origins=origins) if SocketIO else None

mongo_uri = os.getenv("MONGODB_URI")
mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000) if mongo_uri else None
database = mongo_client[os.getenv("MONGODB_DB_NAME", "employee_attrition")] if mongo_client else None
employees = database.employees if database is not None else None
assessments = database.assessments if database is not None else None
hr_users = database.hr_users if database is not None else None
notifications = database.notifications if database is not None else None


def db_required():
    return error("MongoDB is not configured", 503) if database is None else None


def initialize_database():
    if database is None: return
    employees.create_index([ ("email", ASCENDING) ], unique=True)
    employees.create_index([ ("employee_id", ASCENDING) ], unique=True)
    hr_users.create_index([ ("email", ASCENDING) ], unique=True)
    assessments.create_index([ ("employee_id", ASCENDING) ], unique=True)
    assessments.create_index([ ("selected_hr_id", ASCENDING), ("created_at", DESCENDING) ])
    notifications.create_index([ ("employee_id", ASCENDING), ("created_at", DESCENDING) ])
    if hr_users.count_documents({}) == 0:
        hr_users.insert_many([{ "hr_id": item[0], "name": item[1], "email": item[2], "password_hash": generate_password_hash("demo123"), "role": "HR Manager", "department": "HR Operations", "avatar_ref": item[0], "created_at": now() } for item in HR_DEMO])
    if employees.count_documents({}) == 0:
        employees.insert_many([{ "employee_id": "EMP001", "name": "Demo Employee One", "email": "employee1@demo.com", "password_hash": generate_password_hash("demo123"), "whatsapp_number": "", "created_at": now() }, { "employee_id": "EMP002", "name": "Demo Employee Two", "email": "employee2@demo.com", "password_hash": generate_password_hash("demo123"), "whatsapp_number": "", "created_at": now() }])


@app.get("/")
def home(): return jsonify({"status": "success", "message": "Employee Attrition API is running"})


@app.get("/api/health")
def health():
    if database is None: return error("MongoDB is not configured", 503)
    try: mongo_client.admin.command("ping"); return jsonify({"status": "success", "database": "connected"})
    except Exception: return error("Database unavailable", 503)


@app.post("/api/auth/employee/signup")
def employee_signup():
    if (failure := db_required()): return failure
    body = request.get_json(silent=True) or {}
    name, email, password = str(body.get("name", "")).strip(), str(body.get("email", "")).strip().lower(), str(body.get("password", ""))
    whatsapp_number = str(body.get("whatsapp_number", body.get("whatsapp", ""))).strip()
    employee_id = str(body.get("employee_id", body.get("employeeId", ""))).strip() or f"EMP{employees.count_documents({}) + 1:03d}"
    if not name or not email or len(password) < 6 or not whatsapp_number: return error("name, email, password (6+ characters), and whatsapp_number are required", 400)
    document = {"employee_id": employee_id, "name": name, "email": email, "password_hash": generate_password_hash(password), "whatsapp_number": whatsapp_number, "created_at": now()}
    try: employees.insert_one(document)
    except DuplicateKeyError: return error("Email or employee ID already exists", 409)
    return jsonify({"status": "success", "employee": employee_public(document)}), 201


@app.post("/api/auth/employee/login")
def employee_login():
    if (failure := db_required()): return failure
    body = request.get_json(silent=True) or {}; employee = employees.find_one({"email": str(body.get("email", "")).strip().lower()})
    if not employee or not check_password_hash(employee["password_hash"], str(body.get("password", ""))): return error("Invalid credentials", 401)
    return jsonify({"status": "success", "token": token("employee", employee["employee_id"]), "user": employee_public(employee)})


@app.post("/api/auth/hr/login")
def hr_login():
    if (failure := db_required()): return failure
    body = request.get_json(silent=True) or {}; hr = hr_users.find_one({"email": str(body.get("email", "")).strip().lower()})
    if not hr or not check_password_hash(hr["password_hash"], str(body.get("password", ""))): return error("Invalid credentials", 401)
    return jsonify({"status": "success", "token": token("hr", hr["hr_id"]), "user": {"hr_id": hr["hr_id"], "name": hr["name"], "email": hr["email"], "role": hr["role"], "department": hr["department"], "avatar_ref": hr["avatar_ref"]}})


@app.get("/api/employee/me")
@auth_required("employee")
def employee_me():
    employee = employees.find_one({"employee_id": request.auth["sub"]})
    return error("Employee not found", 404) if not employee else jsonify({"status": "success", "employee": employee_public(employee)})


@app.get("/api/employee/status")
@auth_required("employee")
def employee_status_route():
    employee = employees.find_one({"employee_id": request.auth["sub"]}); assessment = assessments.find_one({"employee_id": request.auth["sub"]})
    return error("Employee not found", 404) if not employee else jsonify({"status": "success", "employee": status_view(assessment, employee)})


@app.post("/api/assessments")
@auth_required("employee")
def create_assessment():
    if (failure := db_required()): return failure
    body = request.get_json(silent=True) or {}; selected_hr_id = str(body.get("selected_hr_id", "")).strip(); features = body.get("features", {})
    if (validation := validate_features(features)): return error(validation, 400)
    hr = hr_users.find_one({"hr_id": selected_hr_id}); employee = employees.find_one({"employee_id": request.auth["sub"]})
    if not hr: return error("Selected HR was not found", 400)
    if not employee: return error("Employee not found", 404)
    result = predict_attrition({key: features[key] for key in FEATURES}); timestamp = now()
    document = {"employee_id": employee["employee_id"], "selected_hr_id": selected_hr_id, "selected_hr_name": hr["name"], "features": {key: features[key] for key in FEATURES}, "prediction": result["attrition"], "probability": result["probability"], "risk": result["risk"], "submission_status": "Submitted", "review_status": "Pending", "review": {"note": None, "decision": None, "reviewed_by": None, "reviewed_by_name": None, "reviewed_at": None}, "notification_status": None, "created_at": timestamp, "updated_at": timestamp}
    assessments.replace_one({"employee_id": employee["employee_id"]}, document, upsert=True)
    if socketio: socketio.emit("new_assessment", {"employee_id": employee["employee_id"], "selected_hr_id": selected_hr_id})
    return jsonify({"status": "success", "message": "Assessment submitted successfully", "employee": status_view(document, employee)}), 201


@app.get("/api/hr/dashboard")
@auth_required("hr")
def hr_dashboard():
    if (failure := db_required()): return failure
    records = list(assessments.find({"selected_hr_id": request.auth["sub"]}))
    return jsonify({"status": "success", "total_employees": employees.count_documents({}), "submitted_to_me": len(records), "pending_reviews": sum(item.get("review_status") == "Pending" for item in records), "reviewed": sum(item.get("review_status") == "Reviewed" for item in records), "risk_distribution": {risk: sum(item.get("risk") == risk for item in records) for risk in ("Low", "Medium", "High")}, "review_status": {status: sum(item.get("review_status") == status for item in records) for status in ("Pending", "Under Review", "Reviewed")}})


@app.get("/api/hr/employees")
@auth_required("hr")
def hr_employee_list():
    if (failure := db_required()): return failure
    result = []
    for assessment in assessments.find({"selected_hr_id": request.auth["sub"]}).sort("created_at", DESCENDING):
        employee = employees.find_one({"employee_id": assessment["employee_id"]})
        if employee: result.append(hr_view(assessment, employee))
    return jsonify({"status": "success", "employees": result})


@app.get("/api/hr/employees/<employee_id>")
@auth_required("hr")
def hr_employee_details(employee_id):
    if (failure := db_required()): return failure
    assessment = assessments.find_one({"employee_id": employee_id, "selected_hr_id": request.auth["sub"]}); employee = employees.find_one({"employee_id": employee_id})
    if not employee or not assessment: return error("Employee not found in your review queue", 404)
    return jsonify({"status": "success", "employee": hr_view(assessment, employee)})


@app.post("/api/hr/employees/<employee_id>/review")
@auth_required("hr")
def save_review(employee_id):
    if (failure := db_required()): return failure
    body = request.get_json(silent=True) or {}; decision = str(body.get("decision", "")).strip().lower(); note = str(body.get("note", "")).strip()
    if decision not in ("continued", "discontinued") or not note: return error("decision must be continued or discontinued and note is required", 400)
    assessment = assessments.find_one({"employee_id": employee_id, "selected_hr_id": request.auth["sub"]}); employee = employees.find_one({"employee_id": employee_id}); hr = hr_users.find_one({"hr_id": request.auth["sub"]})
    if not assessment or not employee: return error("Employee not found in your review queue", 404)
    timestamp = now(); review = {"note": note, "decision": decision.title(), "reviewed_by": hr["hr_id"], "reviewed_by_name": hr["name"], "reviewed_at": timestamp}; notification_status = None
    if decision == "discontinued":
        message = f"Hello {employee['name']},\n\nYour HR review has been completed.\n\nDecision: Your employment has been discontinued.\n\nPlease contact the HR team if you have any questions.\n\n- Employee Attrition Intelligence"
        notification_status, notification_result = whatsapp(employee, message)
        notification_error = notification_result if notification_status == "failed" else None
        notification_record = {"employee_id": employee_id, "type": "discontinuation", "message": message, "status": notification_status, "provider": "meta_whatsapp", "sent_at": timestamp if notification_status == "accepted" else None, "error": notification_error, "created_at": timestamp}
        if notification_status == "accepted": notification_record["provider_response"] = notification_result
        notifications.insert_one(notification_record)
    assessments.update_one({"_id": assessment["_id"]}, {"$set": {"review": review, "review_status": "Reviewed", "notification_status": notification_status, "updated_at": timestamp}})
    if socketio: socketio.emit("review_updated", {"employee_id": employee_id})
    return jsonify({"status": "success", "message": "Review saved", "decision": review["decision"], "notification_status": notification_status})


@app.post("/predict")
def predict():
    body = request.get_json(silent=True) or {}
    if (validation := validate_features(body)): return error(validation, 400)
    try: return jsonify(predict_attrition({key: body[key] for key in FEATURES}))
    except Exception: return error("Prediction service unavailable", 500)


initialize_database()

if __name__ == "__main__":
    runner = socketio.run if socketio else app.run
    runner(app, host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=os.getenv("FLASK_DEBUG", "false").lower() == "true") if socketio else runner(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")
