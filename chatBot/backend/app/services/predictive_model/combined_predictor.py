import pandas as pd
from .weather_forecast import generate_lstm_forecast, retrain_lstm_model
from .disaster_management import predict_future_disasters, Flood_df, retrain_disaster_model
from .sarima_trend import get_sarima_forecast, get_global_warming_trend, retrain_sarima_model


def generate_combined_predictions():
    print("↪️ SARIMA...")
    sarima = get_sarima_forecast(steps=24)
    print("↪️ LSTM weather...")
    lstm  = generate_lstm_forecast(steps=730)
    print("↪️ Disasters...")
    floods = predict_future_disasters(Flood_df, "Flood", years_to_predict=2)
    print("↪️ Warming trend...")
    warming = get_global_warming_trend()

    return {
        "SARIMA (mo)": sarima,
        "LSTM (day)": lstm,
        "Floods (yr)": floods,
        "Trend": warming
    }

def retrain_all_models():
    print("🔄 Retraining SARIMA…")
    sarima_fc = pd.Series(generate_combined_predictions()["SARIMA (mo)"])
    retrain_sarima_model(sarima_fc)

    print("🔄 Retraining LSTM…")
    retrain_lstm_model()

    print("🔄 Retraining Disaster model…")
    retrain_disaster_model()
