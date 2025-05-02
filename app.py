from flask import Flask, render_template, request
import os
import csv
from utils.nlp import extract_tags

app = Flask(__name__)

# Set up the upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Simulating CSV parsing
def parse_csv(file_path):
    candidates = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            candidates.append({
                "name": row["name"],
                "resume": row["resume"]
            })
    return candidates

@app.route("/", methods=["GET", "POST"])
def dashboard():
    results = []
    if request.method == "POST":
        job_title = request.form["job_title"]
        skills = request.form["skills"].split(",")
        file = request.files["resume_file"]

        if file:
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            candidates = parse_csv(filepath)

            for c in candidates:
                tags, score = extract_tags(c["resume"], skills)
                results.append({
                    "name": c["name"],
                    "matched_skills": tags,
                    "score": score
                })

    return render_template("dashboard.html", results=results)

if __name__ == "__main__":
    app.run(debug=True)
