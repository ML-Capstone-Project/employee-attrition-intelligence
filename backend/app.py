from flask import Flask, request, jsonify
from flask_cors import CORS

import sys
from pathlib import Path


# --------------------------------------------------
# Project paths
# --------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_DIR / "src"

sys.path.append(str(SRC_DIR))


# --------------------------------------------------
# Import prediction function
# --------------------------------------------------

from prediction import predict_attrition


# --------------------------------------------------
# Flask app
# --------------------------------------------------

app = Flask(__name__)


# --------------------------------------------------
# CORS
# --------------------------------------------------

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://employee-attrition-capstone.netlify.app"
            ]
        }
    }
)


# --------------------------------------------------
# Home route
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Employee Attrition API is running"
    })


# --------------------------------------------------
# Prediction route
# --------------------------------------------------

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():

    # Handle browser CORS preflight request
    if request.method == "OPTIONS":
        return "", 204

    try:

        employee_data = request.get_json()

        if not employee_data:

            return jsonify({
                "error": "No employee data received"
            }), 400

        result = predict_attrition(employee_data)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------------------------
# Run locally
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )