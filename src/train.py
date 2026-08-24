from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

from preprocess import clean_data


FEATURES = [
    "Age",
    "JobLevel",
    "JobSatisfaction",
    "EnvironmentSatisfaction",
    "JobInvolvement",
    "MonthlyIncome",
    "OverTime",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsWithCurrManager",
    "JobRole"
]


def train_and_save_model():

    # Load dataset
    path = (
        Path(__file__).resolve().parent
        / "data"
        / "employee_attrition.csv"
    )

    df = pd.read_csv(
        path,
        sep="\t"
    )

    # Clean dataset
    df = clean_data(df)

    # Select required columns
    df = df[FEATURES + ["Attrition"]]

    # Separate X and y
    X = df[FEATURES]
    y = df["Attrition"]

    # Convert target
    y = y.map({
        "No": 0,
        "Yes": 1
    })

    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Numerical columns
    numerical_cols = [
        "Age",
        "JobLevel",
        "JobSatisfaction",
        "EnvironmentSatisfaction",
        "JobInvolvement",
        "MonthlyIncome",
        "WorkLifeBalance",
        "YearsAtCompany",
        "YearsInCurrentRole",
        "YearsWithCurrManager"
    ]

    # Categorical columns
    categorical_cols = [
        "OverTime",
        "JobRole"
    ]

    # Column Transformer
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                StandardScaler(),
                numerical_cols
            ),
            (
                "cat",
                OneHotEncoder(
                    handle_unknown="ignore"
                ),
                categorical_cols
            )
        ]
    )

    # Preprocess training data
    X_train = preprocessor.fit_transform(
        X_train
    )

    # Preprocess testing data
    X_test = preprocessor.transform(
        X_test
    )

    # Models
    models = {

        "Logistic Regression":
            LogisticRegression(
                max_iter=1000,
                random_state=42
            ),

        "KNN":
            KNeighborsClassifier(
                n_neighbors=5
            ),

        "Decision Tree":
            DecisionTreeClassifier(
                random_state=42
            ),

        "Random Forest":
            RandomForestClassifier(
                n_estimators=100,
                random_state=42
            )
    }

    # Store results
    results = []
    confusion_results = []

    # Best model variables
    best_model = None
    best_f1 = 0
    best_name = ""

    # Compare models
    for name, model in models.items():

        model.fit(
            X_train,
            y_train
        )

        prediction = model.predict(
            X_test
        )

        # Metrics
        accuracy = accuracy_score(
            y_test,
            prediction
        )

        precision = precision_score(
            y_test,
            prediction,
            zero_division=0
        )

        recall = recall_score(
            y_test,
            prediction,
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            prediction,
            zero_division=0
        )

        # Confusion Matrix
        tn, fp, fn, tp = confusion_matrix(
            y_test,
            prediction
        ).ravel()

        # Store metrics
        results.append({
            "Model": name,
            "Accuracy": accuracy,
            "Precision": precision,
            "Recall": recall,
            "F1 Score": f1
        })

        # Store confusion matrix
        confusion_results.append({
            "Model": name,
            "TN": tn,
            "FP": fp,
            "FN": fn,
            "TP": tp
        })

        # Select best model using F1
        if f1 > best_f1:

            best_f1 = f1
            best_model = model
            best_name = name

    # Results table
    results_df = pd.DataFrame(
        results
    )

    print("\nEVALUATION METRICS")
    print("=" * 80)

    print(
        results_df
        .sort_values(
            by="F1 Score",
            ascending=False
        )
        .to_string(index=False)
    )

    # Confusion matrix table
    confusion_df = pd.DataFrame(
        confusion_results
    )

    print("\nCONFUSION MATRIX")
    print("=" * 80)

    print(
        confusion_df.to_string(
            index=False
        )
    )

    # Best model
    print("\nBEST MODEL")
    print("=" * 80)

    print(
        f"Model: {best_name}"
    )

    print(
        f"F1 Score: {best_f1:.4f}"
    )

    # Save files
    model_dir = (
        Path(__file__).resolve().parent
        / "models"
    )

    model_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    # Save best model
    joblib.dump(
        best_model,
        model_dir / "employee_attrition_model.pkl"
    )

    # Save preprocessor
    joblib.dump(
        preprocessor,
        model_dir / "preprocessor.pkl"
    )

    # Save features
    joblib.dump(
        FEATURES,
        model_dir / "features.pkl"
    )

    print("\nModel Saved Successfully!")


if __name__ == "__main__":
    train_and_save_model()