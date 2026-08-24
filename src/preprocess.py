import pandas as pd
def clean_data(df):
# Removing extra spaces
    df.columns = df.columns.str.strip()
# Removing unnecessary columns
    df = df.drop(
        ["EmployeeCount", "EmployeeNumber", "Over18", "StandardHours"],
        axis=1,
        errors="ignore"
    )
  # Remove duplicate rows
    df = df.drop_duplicates()
    return df