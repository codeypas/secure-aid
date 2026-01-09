# app/routes/forecast_routes.py
from flask import Blueprint, jsonify, request
from app.services.forecast import get_sarima_forecast, get_global_warming_trend

forecast_bp = Blueprint('forecast', __name__, url_prefix='/api/forecast')

@forecast_bp.route('/sarima', methods=['GET'])
def sarima_forecast():
    steps = request.args.get('steps', default=12, type=int)
    forecast = get_sarima_forecast(steps)
    return jsonify({"forecast": forecast})

@forecast_bp.route('/global-warming-trend', methods=['GET'])
def global_warming_trend():
    trend_data = get_global_warming_trend()
    return jsonify({
        "data": {
            "years": trend_data['year'].tolist(),
            "temperatures": trend_data['tavg'].tolist()
        }
    })
