import csv

def parse_csv(filepath):
    candidates = []
    with open(filepath, mode="r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            candidates.append({
                "name": row["name"],
                "resume": row["resume"]
            })
    return candidates
