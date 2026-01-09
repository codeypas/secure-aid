from app.models.user import User
from flask import Blueprint, jsonify, request
import getpass
import requests
current_weather_bp = Blueprint('current_weather', __name__)

def get_weather_data(location):
    lat, lon = location.split(",")
    lat, lon = lat.strip(), lon.strip()
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=5facc90183d09954c6363853674d6353"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        return None

@current_weather_bp.route("/getdata",methods=["POST"])
def get_current_weather():
    data = request.get_json()
    email_id = data['email_id']
    if data['email_id'] is None:
        return jsonify({"error": "Email ID is required"}), 400
    try:
        user = User.query.filter_by(email=email_id).first()
        if user is None or not user.lat or not user.lon:
            return jsonify({"error": "User's location not found"}), 404
        user_location = f"{user.lat},{user.lon}"
        if user_location == "":
            return jsonify({"error": "User's location not found"}), 404
        
        # calling the get weather function
        weather_data = get_weather_data(user_location)
        if weather_data is None:
            return jsonify({"error": "Weather data not found"}), 404
        return jsonify(weather_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500