import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "./data/northindian.csv")
MODEL_PATH = os.path.join(BASE_DIR, "./ml_models/lstm_weather_model.pkl")

def _prepare_series(time_step=30):
    df = pd.read_csv(DATA_PATH)
    series = df['temp_max'].values.reshape(-1,1)
    scaler = MinMaxScaler((0,1))
    scaled = scaler.fit_transform(series)
    X, y = [], []
    for i in range(len(scaled)-time_step-1):
        X.append(scaled[i:(i+time_step),0])
        y.append(scaled[i+time_step,0])
    X = np.array(X).reshape(-1, time_step, 1)
    y = np.array(y)
    return X, y, scaler

def generate_lstm_forecast(steps=365):
    """Loads (or trains) the LSTM, then rolls forward `steps` days of forecast."""
    
    if os.path.exists(MODEL_PATH):
        model = pickle.load(open(MODEL_PATH, 'rb'))
        X, y, scaler = _prepare_series()
    else:
        model, scaler = retrain_lstm_model()
        X, y, _ = _prepare_series()
   
    last_seq = X[-1].flatten().tolist()
    output = []
    for _ in range(steps):
        arr = np.array(last_seq[-30:]).reshape(1,30,1)
        pred = model.predict(arr, verbose=0)[0][0]
        output.append(pred)
        last_seq.append(pred)
    
    return scaler.inverse_transform(np.array(output).reshape(-1,1)).flatten().tolist()

def retrain_lstm_model(epochs=50, batch_size=64):
    """Trains a fresh LSTM on full history, saves it, and returns (model, scaler)."""
    X, y, scaler = _prepare_series()
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(X.shape[1],1)),
        LSTM(50, return_sequences=True),
        LSTM(50),
        Dense(1)
    ])
    model.compile(loss='mean_squared_error', optimizer='adam')
    model.fit(X, y, epochs=epochs, batch_size=batch_size, verbose=1)
    pickle.dump(model, open(MODEL_PATH, 'wb'))
    print("LSTM weather model trained & saved.")
    return model, scaler
