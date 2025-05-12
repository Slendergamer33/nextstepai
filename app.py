from flask import Flask, render_template, request, flash, redirect, url_for
from utils.nlp import extract_tags
from utils.parse_csv import parse_csv
import os
import requests
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

@app.route("/submit-form", methods=["POST"])
def submit_form():
    name = request.form.get("name")
    email = request.form.get("email")
    company = request.form.get("company", "")  # Default to empty string if not provided
    notes = request.form.get("notes", "")  # Default to empty string if not provided

    print(f"Received name: {name}, email: {email}")


    # Ensure required fields are provided
    if not name or not email:
        flash("Name and email are required.", "error")
        return redirect(url_for("dashboard"))

    try:
        # Send form data to Express API
        response = requests.post("http://localhost:3000/intake", json={
            "name": name,
            "email": email,
            "company": company,
            "notes": notes
        })
        data = response.json()

        if response.ok:
            flash("Data successfully submitted to Supabase!", "success")
        else:
            error_message = data.get('message', 'Unknown error')
            flash(f"Express API error: {error_message}", "error")

    except Exception as e:
        flash(f"Failed to reach Express API: {e}", "error")
    

    return redirect(url_for("dashboard"))

if __name__ == "__main__":
    app.run(debug=True)
