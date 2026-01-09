# backend/app/state.py

PREDICTION_CACHE = {}

def refresh_predictions():
    from app.services.predictive_model.combined_predictor import generate_combined_predictions
    global PREDICTION_CACHE
    PREDICTION_CACHE = generate_combined_predictions()

