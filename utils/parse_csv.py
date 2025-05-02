import pandas as pd

def parse_csv(file_path):
    df = pd.read_csv(file_path)
    candidates = []

    for index, row in df.iterrows():
        candidates.append({
            "name": row["Name"],
            "resume": row["Resume"]
        })

    return candidates
