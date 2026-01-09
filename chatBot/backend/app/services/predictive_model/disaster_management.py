import pandas as pd
from datetime import datetime
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "./data/Natural_Disasters_in_India.csv")
MODEL_PATH = os.path.join(BASE_DIR, "./ml_models/disaster_predictor.pkl")

def predict_future_disasters(df, disaster_type, years_to_predict=2):
    """
    Simple predictor: average annual count for next N years.
    Returns a dict {year: count}.
    """
   
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df = df.dropna(subset=['Date'])
    df = df.set_index('Date').resample('Y').count()['Title']
    avg = int(df.mean())
    last = df.index[-1].year
    return {yr: avg for yr in range(last+1, last+1+years_to_predict)}

def retrain_disaster_model():
    """
    Placeholder: if you have a learned model for disasters, retrain here.
    For now this just re-pickles the raw data.
    """
    df = pd.read_csv(DATA_PATH)
    pickle.dump(df, open(MODEL_PATH, 'wb'))
    print("Disaster data saved for prediction.")
    return df


_full_df = pd.read_csv(DATA_PATH)
Flood_df = _full_df[_full_df['Title'].str.lower().str.contains("flood")]
