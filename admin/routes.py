from flask import Blueprint, render_template, request, redirect, url_for, session

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# Simulated admin user
ADMIN_USER = "admin"
ADMIN_PASS = "nextstepai"

@admin_bp.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if username == ADMIN_USER and password == ADMIN_PASS:
            session["admin_logged_in"] = True
            return redirect(url_for("admin.dashboard"))
    return render_template("admin.html")

@admin_bp.route("/dashboard")
def dashboard():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin.login"))
    return render_template("admin_dashboard.html")

@admin_bp.route("/logout")
def logout():
    session.pop("admin_logged_in", None)
    return redirect(url_for("admin.login"))
