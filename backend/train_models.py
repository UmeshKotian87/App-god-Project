import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

print("Training synthetic models...")

# 1. Diabetes Model
# Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
np.random.seed(42)
X_diabetes = np.random.rand(1000, 8) * 100
y_diabetes = np.random.randint(0, 2, 1000)
diabetes_model = RandomForestClassifier(n_estimators=100, random_state=42)
diabetes_model.fit(X_diabetes, y_diabetes)
joblib.dump(diabetes_model, 'models/diabetes.pkl')
print("Diabetes model trained and saved.")

# 2. Heart Disease Model
# Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
X_heart = np.random.rand(1000, 13) * 100
y_heart = np.random.randint(0, 2, 1000)
heart_model = RandomForestClassifier(n_estimators=100, random_state=42)
heart_model.fit(X_heart, y_heart)
joblib.dump(heart_model, 'models/heart.pkl')
print("Heart Disease model trained and saved.")

# 3. Parkinson's Model
# Features: MDVP:Fo(Hz), MDVP:Fhi(Hz), MDVP:Flo(Hz), MDVP:Jitter(%), MDVP:Jitter(Abs), MDVP:RAP, MDVP:PPQ, Jitter:DDP, MDVP:Shimmer, MDVP:Shimmer(dB), Shimmer:APQ3, Shimmer:APQ5, MDVP:APQ, Shimmer:DDA, NHR, HNR, RPDE, DFA, spread1, spread2, D2, PPE
X_parkinsons = np.random.rand(1000, 22) * 10
y_parkinsons = np.random.randint(0, 2, 1000)
parkinsons_model = RandomForestClassifier(n_estimators=100, random_state=42)
parkinsons_model.fit(X_parkinsons, y_parkinsons)
joblib.dump(parkinsons_model, 'models/parkinsons.pkl')
print("Parkinsons model trained and saved.")

print("All models trained successfully!")
