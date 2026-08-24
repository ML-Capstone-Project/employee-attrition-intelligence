from pathlib import Path

import joblib
import pandas as pd


PROJECT_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    PROJECT_DIR
    / "models"
    / "employee_attrition_model.pkl"
)

PREPROCESSOR_PATH = (
    PROJECT_DIR
    / "models"
    / "preprocessor.pkl"
)


model = joblib.load(MODEL_PATH)

preprocessor = joblib.load(
    PREPROCESSOR_PATH
)


def predict_attrition(employee_data):

    employee_df = pd.DataFrame(
        [employee_data]
    )

    employee_processed = (
        preprocessor.transform(employee_df)
    )

    prediction = model.predict(
        employee_processed
    )[0]

    probability = model.predict_proba(
        employee_processed
    )[0][1]

    if prediction == 1:
        attrition = "Yes"
    else:
        attrition = "No"

    if probability >= 0.70:
        risk = "High"

    elif probability >= 0.40:
        risk = "Medium"

    else:
        risk = "Low"

    return {
        "attrition": attrition,
        "probability": round(
            probability * 100,
            2
        ),
        "risk": risk
    }