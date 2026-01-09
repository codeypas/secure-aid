from flask import Blueprint, request, jsonify
from app.services.llm_handler import chat_with_agent

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chat", methods=["POST"])
def get_llm_res():
    data = request.get_json()

    prompt = data.get("prompt", "").strip()
    email = data.get("email", "").strip()
    lat = data.get("lat")
    lon = data.get("lon")

    if not prompt or not email or lat is None or lon is None:
        return jsonify({"error": "Prompt, email, lat, and lon are required"}), 400

    try:
        response = chat_with_agent(prompt, email, lat, lon)
        return jsonify({"answer": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
