import pickle
import os
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError




with open("../services/predictive_model/ml_models/sarima_model.pkl", "rb") as f:
    sarima_model = pickle.load(f)



lstm_model = load_model("../services/predictive_model/ml_models/lstm_weather_model.h5", 
                        custom_objects={"mse": MeanSquaredError()})



with open("../services/predictive_model/ml_models/lstm_scaler.pkl", "rb") as f:
    lstm_scaler = pickle.load(f)

# Load disaster model
with open("../services/predictive_model/ml_models/disaster_predictor.pkl", "rb") as f:
    disaster_model = pickle.load(f)


combined = {
    'sarima': sarima_model,
    'lstm': (lstm_model, lstm_scaler),
    'disaster': disaster_model
}


with open("../services/predictive_model/ml_models/combined_predictor.pkl", "wb") as f:
    
    pickle.dump(combined, f)

print("✅ Combined model saved.")
