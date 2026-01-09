import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import pickle

df = pd.read_csv('../services/predictive_model/data/northindian.csv')
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

ts = df['precipitation'].values.reshape(-1, 1)

scaler = MinMaxScaler()
ts_scaled = scaler.fit_transform(ts)

# Create sequences
def create_sequences(data, seq_length=30):
    xs, ys = [], []
    for i in range(len(data) - seq_length):
        x = data[i:i+seq_length]
        y = data[i+seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

X, y = create_sequences(ts_scaled)

# Model
model = Sequential([
    LSTM(64, input_shape=(X.shape[1], 1)),
    Dense(1)
])

model.compile(loss='mse', optimizer='adam')
model.fit(X, y, epochs=20, batch_size=16)

# Save model & scaler
model.save('../services/predictive_model/ml_models/lstm_weather_model.h5')
with open('../services/predictive_model/ml_models/lstm_scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("✅ LSTM model trained and saved.")
