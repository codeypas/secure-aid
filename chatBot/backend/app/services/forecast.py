import os
import pickle
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SARIMA_MODEL_PATH = os.path.join(BASE_DIR, "./predictive_model/ml_models/sarima_model.pkl")
GLOBAL_WARMING_TREND_MODEL_PATH = os.path.join(BASE_DIR, "./predictive_model/ml_models/GlobalWarmingTrend.pkl")

def get_sarima_forecast(steps=12):
    """
    Loads the SARIMA model from disk, performs forecasting for the given steps,
    prints the prediction time, and returns the predicted values.
    """
    with open(SARIMA_MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    
    start_time = time.time()
    forecast = model.get_forecast(steps=steps).predicted_mean
    end_time = time.time()
    
    print(f"SARIMA prediction time: {end_time - start_time:.4f} seconds")
    
   
    return forecast.tolist()

def get_global_warming_trend():
    """
    Loads the Global Warming Trend model from disk and returns its data.
    Modify this function if you need to extract specific information from the model.
    """
    with open(GLOBAL_WARMING_TREND_MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    
    return {
        "year": model['year'],
        "tavg": model['tavg'],
    }

if __name__ == "__main__":
   
    sarima_data = get_sarima_forecast(steps=12)
    print("SARIMA Forecast:", sarima_data)
    
    global_warming_data = get_global_warming_trend()
    print("Global Warming Trend Model Data:", global_warming_data)