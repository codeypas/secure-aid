from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User

location_bp = Blueprint("user_location", __name__)

@location_bp.route("/get-location", methods=["POST"])
def get_location():
    try:
        data = request.get_json()
        email = data.get("email", "").strip()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email": user.email,
            "lat": user.lat,
            "lon": user.lon
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
