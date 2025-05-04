import pandas as pd

def parse_csv(filepath):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(filepath)

    print(df.head)

    candidates = []
    for index, row in df.iterrows():
        candidate = {
            "name": row["name"],  # Make sure this matches the column name in your CSV
            "resume": row["resume"]
        }
        candidates.append(candidate)

    return candidates
