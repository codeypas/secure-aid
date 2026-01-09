import os
import pickle
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SARIMA_MODEL_PATH = os.path.join(BASE_DIR, "./ml_models/sarima_model.pkl")
GLOBAL_WARMING_TREND_PATH = os.path.join(BASE_DIR, "./ml_models/GlobalWarmingTrend.pkl")
UPDATED_SARIMA_PATH = os.path.join(BASE_DIR, "./ml_models/sarima_model_updated.pkl")

def get_sarima_forecast(steps=24):
    with open(SARIMA_MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    start = time.time()
    fc = model.get_forecast(steps=steps).predicted_mean
    print(f"SARIMA forecast in {time.time()-start:.3f}s")
    return fc.tolist()

def get_global_warming_trend():
    with open(GLOBAL_WARMING_TREND_PATH, 'rb') as f:
        data = pickle.load(f)
    return {"year": data['year'], "tavg": data['tavg']}

def retrain_sarima_model(new_data):
    import pandas as pd
    from statsmodels.tsa.statespace.sarimax import SARIMAX
    import pickle
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_PATH = os.path.join(BASE_DIR, "data/northindian.csv")
    SARIMA_UPDATED = os.path.join(BASE_DIR, "ml_models/sarima_model_updated.pkl")

    
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])
    df = df.set_index('date')
    series = df['temp_max'].resample('M').mean()

    # Build proper datetime index for new forecast data
    forecast_index = pd.date_range(start=series.index[-1] + pd.DateOffset(months=1), periods=len(new_data), freq='M')
    new_series = pd.Series(new_data, index=forecast_index)

   
    combined = pd.concat([series, new_series])

    
    model = SARIMAX(combined, order=(1,1,1), seasonal_order=(1,1,1,12))
    model_fit = model.fit()

    # Save updated model
    with open(SARIMA_UPDATED, 'wb') as f:
        pickle.dump(model_fit, f)

    print("✅ SARIMA model retrained and saved.")
    return model_fit

