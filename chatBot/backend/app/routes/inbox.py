from flask import Blueprint, request, jsonify
from app import db
from app.models.inbox import Inbox
from datetime import datetime

inbox_bp = Blueprint('inbox', __name__)

@inbox_bp.route('/', methods=['POST'])
def create_message():
    data = request.get_json()
    email = data.get('email')
    message = data.get('message')

    if not email or not message:
        return jsonify({'error': 'Email and message are required'}), 400

    inbox_entry = Inbox(email=email, message=message)
    db.session.add(inbox_entry)
    db.session.commit()

    return jsonify({'message': 'Inbox message saved successfully'}), 201


@inbox_bp.route('/', methods=['GET'])
def get_messages():
    messages = Inbox.query.order_by(Inbox.dateTime.desc()).all()

    response = [{
        'id': msg.id,
        'email': msg.email,
        'message': msg.message,
        'dateTime': msg.dateTime.isoformat()
    } for msg in messages]

    return jsonify(response), 200


@inbox_bp.route('/<int:id>', methods=['GET'])
def get_message_by_id(id):
    msg = Inbox.query.get(id)
    if not msg:
        return jsonify({'error': 'Message not found'}), 404

    response = {
        'id': msg.id,
        'email': msg.email,
        'message': msg.message,
        'dateTime': msg.dateTime.isoformat()
    }

    return jsonify(response), 200