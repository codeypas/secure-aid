import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv('../services/predictive_model/data/Natural_Disasters_in_India.csv')

X = df['Title']
y = df['Disaster_Info']  
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

clf = RandomForestClassifier()
clf.fit(X_vec, y)

with open('../services/predictive_model/ml_models/disaster_predictor.pkl', 'wb') as f:
    pickle.dump((vectorizer, clf), f)

print("✅ Disaster model trained and saved.")
