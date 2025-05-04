from flask import Flask, render_template, request, flash, redirect, url_for
from utils.nlp import extract_tags
from utils.parse_csv import parse_csv
import os
from admin.routes import admin_bp

app = Flask(__name__)
app.secret_key = "nextstepai_secret"  # Needed for sessions
app.register_blueprint(admin_bp, url_prefix="/admin")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def dashboard():
    results = []
    if request.method == "POST":
        job_title = request.form["job_title"]
        skills = request.form["skills"].split(",")
        file = request.files["resume_file"]

        if not file:
            flash("No file selected. Please upload a valid CSV file.", "error")
            return redirect(url_for("dashboard"))
        
        if file:
            try:
                # Save the file to the uploads folder
                filepath = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(filepath)
                
                # Parse the CSV file to extract candidate data
                candidates = parse_csv(filepath)

                if not candidates:
                    flash("No valid candidates found in the CSV file.", "error")
                else:
                    for c in candidates:
                        tags, score = extract_tags(c["resume"], skills)
                        results.append({
                            "name": c["name"],
                            "matched_skills": tags,
                            "score": score
                        })
                    flash("File processed successfully! Results are displayed below.", "success")

            except Exception as e:
                flash(f"An error occurred while processing the file: {e}", "error")
                return redirect(url_for("dashboard"))

    return render_template("dashboard.html", results=results)

if __name__ == "__main__":
    app.run(debug=True)
