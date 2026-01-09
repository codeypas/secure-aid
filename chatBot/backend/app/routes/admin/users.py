from app.models.user import User
from flask import Blueprint, jsonify, request
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
def get_users():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        pagination = User.query.paginate(page=page, per_page=per_page, error_out=False)
        users = pagination.items
        users = [user for user in users if user.role != 'admin']
        users_list = [{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "lat": user.lat,
            "lon": user.lon,
        } for user in users]

        return jsonify({
            "users": users_list,
            "total": pagination.total
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/search_users', methods=['GET'])
def search_users():
    try:
        query = request.args.get('query', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        users_query = User.query.filter(
            (User.name.ilike(f'%{query}%')) | 
            (User.email.ilike(f'%{query}%'))
        )

        pagination = users_query.paginate(page=page, per_page=per_page, error_out=False)
        users = pagination.items
        users = [user for user in users if user.role != 'admin']
        users_list = [{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "lat": user.lat,
            "lon": user.lon,
        } for user in users]

        return jsonify({
            "users": users_list,
            "total": pagination.total
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
