from flask import Blueprint, send_from_directory
import os
from app.services.disaster_service import generate_all_graphs

# Blueprint setup
disaster_bp = Blueprint('disaster', __name__, url_prefix='/api/disasters')

# Local graph image directory
GRAPH_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static/graphs')

@disaster_bp.route('/generate', methods=['GET'])
def generate_graphs():
    generate_all_graphs()
    return {"message": "Graphs generated successfully."}, 200

@disaster_bp.route('/graph/<filename>', methods=['GET'])
def get_graph(filename):
    return send_from_directory(GRAPH_DIR, filename)
