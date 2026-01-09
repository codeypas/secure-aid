import pandas as pd
import pickle
from statsmodels.tsa.statespace.sarimax import SARIMAX

df = pd.read_csv('../services/predictive_model/data/northindian.csv')
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)
ts = df['precipitation']  # This is the target variable


model = SARIMAX(ts, order=(1,1,1), seasonal_order=(1,1,1,12))
results = model.fit()

# Save model
with open('../services/predictive_model/ml_models/sarima_model.pkl', 'wb') as f:
    pickle.dump(results, f)

print("✅ SARIMA model trained and saved.")
