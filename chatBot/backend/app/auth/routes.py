from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        name=data["name"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        role=data.get("role", "user"),
        lat = data.get("lat",""),
        lon = data.get("lon",""),
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data.get("lat") or not data.get("lon"):
        return jsonify({"error": "Location is required"}), 400
    
    user = User.query.filter_by(email=data["email"]).first()
    if user and check_password_hash(user.password_hash, data["password"]):
        lat = data['lat']
        lon = data['lon']
        user.lat = lat
        user.lon = lon
        db.session.commit()
        access_token = create_access_token(identity={"id": user.id, "role": user.role,"email": user.email})
        response = make_response('Setting the cookie')
        response.set_cookie('token',access_token,max_age=60*60*24*7)
        return response, 200
    return jsonify({"error": "Invalid credentials"}), 401
