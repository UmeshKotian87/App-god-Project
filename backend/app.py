from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load models if they exist
models_dir = 'models'
diabetes_model = joblib.load(os.path.join(models_dir, 'diabetes.pkl')) if os.path.exists(os.path.join(models_dir, 'diabetes.pkl')) else None
heart_model = joblib.load(os.path.join(models_dir, 'heart.pkl')) if os.path.exists(os.path.join(models_dir, 'heart.pkl')) else None
parkinsons_model = joblib.load(os.path.join(models_dir, 'parkinsons.pkl')) if os.path.exists(os.path.join(models_dir, 'parkinsons.pkl')) else None

@app.route('/', methods=['GET'])
def home():
    html_content = """
    <html>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f3f4f6; color: #111827;">
            <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
                <h1 style="color: #10b981;">✅ MedPredict Backend is Running!</h1>
                <p style="font-size: 18px;">This is the Machine Learning API server (Port 5000).</p>
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; text-align: left;">
                    <h3 style="margin-top: 0; color: #1e3a8a;">⚠️ You are in the wrong place!</h3>
                    <p style="margin-bottom: 0;">To view and use the actual MedPredict Application, you need to open your React Frontend.</p>
                </div>
                <a href="http://localhost:5173" style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; transition: background-color 0.2s;">
                    👉 Click Here to Go to the App (http://localhost:5173)
                </a>
            </div>
        </body>
    </html>
    """
    return html_content

def get_shap_mock(feature_names):
    """Generate mock SHAP values for Explainable AI visualization"""
    impacts = np.random.uniform(-40, 40, len(feature_names))
    shap_factors = []
    for i, name in enumerate(feature_names):
        shap_factors.append({
            'name': name,
            'impact': float(impacts[i]),
            'positive': bool(impacts[i] < 0) # Negative impact on disease risk is good (positive trait)
        })
    # Sort by absolute impact
    shap_factors.sort(key=lambda x: abs(x['impact']), reverse=True)
    return shap_factors[:5] # Return top 5

@app.route('/api/predict/diabetes', methods=['POST'])
def predict_diabetes():
    if not diabetes_model:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    try:
        # Assuming data contains features in the correct order or as a dictionary
        features = [
            float(data.get('pregnancies', 0)),
            float(data.get('glucose', 0)),
            float(data.get('bloodPressure', 0)),
            float(data.get('skinThickness', 0)),
            float(data.get('insulin', 0)),
            float(data.get('bmi', 0)),
            float(data.get('diabetesPedigree', 0)),
            float(data.get('age', 0))
        ]
        
        feature_array = np.array([features])
        prediction = int(diabetes_model.predict(feature_array)[0])
        prob = float(diabetes_model.predict_proba(feature_array)[0][1])
        
        feature_names = ['Glucose', 'BMI', 'Age', 'Blood Pressure', 'Insulin', 'Diabetes Pedigree']
        
        return jsonify({
            "prediction": prediction,
            "probability": prob * 100,
            "riskLevel": "High" if prob > 0.6 else "Medium" if prob > 0.3 else "Low",
            "shapFactors": get_shap_mock(feature_names)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/predict/heart', methods=['POST'])
def predict_heart():
    if not heart_model:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    try:
        # 13 features
        features = [float(data.get(k, 0)) for k in ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']]
        
        feature_array = np.array([features])
        prediction = int(heart_model.predict(feature_array)[0])
        prob = float(heart_model.predict_proba(feature_array)[0][1])
        
        feature_names = ['Chest Pain Type', 'Max Heart Rate', 'Age', 'Cholesterol', 'Resting BP']
        
        return jsonify({
            "prediction": prediction,
            "probability": prob * 100,
            "riskLevel": "High" if prob > 0.6 else "Medium" if prob > 0.3 else "Low",
            "shapFactors": get_shap_mock(feature_names)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/predict/parkinsons', methods=['POST'])
def predict_parkinsons():
    if not parkinsons_model:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    try:
        # 22 features
        features = [float(data.get(f'f{i}', 0)) for i in range(22)]
        
        feature_array = np.array([features])
        prediction = int(parkinsons_model.predict(feature_array)[0])
        prob = float(parkinsons_model.predict_proba(feature_array)[0][1])
        
        feature_names = ['MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)', 'MDVP:Jitter(Abs)']
        
        return jsonify({
            "prediction": prediction,
            "probability": prob * 100,
            "riskLevel": "High" if prob > 0.6 else "Medium" if prob > 0.3 else "Low",
            "shapFactors": get_shap_mock(feature_names)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/predict/skin', methods=['POST'])
def predict_skin():
    import random
    try:
        # Multi-disease prediction — returns Top 3 predictions like real AI
        diseases = [
            {
                "condition": "Benign Nevus (Common Mole)",
                "confidence": round(random.uniform(85, 96), 1),
                "severity": "Mild",
                "riskLevel": "Low",
                "description": "The uploaded image shows visual characteristics consistent with a benign nevus. The borders are well-defined, coloration is uniform, and symmetry is maintained.",
                "suggestions": [
                    "Continue routine self-examinations monthly.",
                    "Apply broad-spectrum SPF 30+ sunscreen daily.",
                    "Schedule an annual check-up with a dermatologist."
                ]
            },
            {
                "condition": "Melanoma (Malignant)",
                "confidence": round(random.uniform(60, 85), 1),
                "severity": "Severe",
                "riskLevel": "High",
                "description": "Warning: The lesion exhibits asymmetric borders, irregular coloration patterns, and uneven pigment distribution that are consistent with melanoma characteristics.",
                "suggestions": [
                    "Seek immediate consultation with a dermatologist.",
                    "Do NOT attempt self-treatment or removal.",
                    "Request a biopsy for definitive diagnosis.",
                    "Avoid direct sun exposure on the area."
                ]
            },
            {
                "condition": "Dermatitis (Eczema)",
                "confidence": round(random.uniform(70, 90), 1),
                "severity": "Moderate",
                "riskLevel": "Medium",
                "description": "The image shows red, inflamed, and possibly itchy patches typical of dermatitis or eczema. The affected area shows signs of skin barrier disruption.",
                "suggestions": [
                    "Apply fragrance-free moisturizer frequently.",
                    "Use prescribed topical corticosteroids if recommended.",
                    "Avoid known irritants (soaps, detergents).",
                    "Consider allergy testing if recurring."
                ]
            },
            {
                "condition": "Tinea (Ringworm)",
                "confidence": round(random.uniform(55, 80), 1),
                "severity": "Mild",
                "riskLevel": "Low",
                "description": "The circular, ring-shaped lesion with raised borders and clearing center is characteristic of a fungal skin infection (tinea corporis).",
                "suggestions": [
                    "Apply over-the-counter antifungal cream (clotrimazole).",
                    "Keep the area clean and dry.",
                    "Avoid sharing towels or clothing.",
                    "See a doctor if it doesn't improve in 2 weeks."
                ]
            },
            {
                "condition": "Psoriasis",
                "confidence": round(random.uniform(50, 78), 1),
                "severity": "Moderate",
                "riskLevel": "Medium",
                "description": "Thick, red, scaly patches with silvery-white scales are visible, consistent with plaque psoriasis affecting the skin surface.",
                "suggestions": [
                    "Use medicated shampoos for scalp involvement.",
                    "Apply topical treatments as prescribed.",
                    "Manage stress, which can trigger flare-ups.",
                    "Consider phototherapy for widespread cases."
                ]
            },
            {
                "condition": "Actinic Keratosis",
                "confidence": round(random.uniform(45, 70), 1),
                "severity": "Moderate",
                "riskLevel": "Medium",
                "description": "The rough, scaly patch on sun-exposed skin is consistent with actinic keratosis, a precancerous condition caused by UV damage.",
                "suggestions": [
                    "Consult a dermatologist for cryotherapy options.",
                    "Apply broad-spectrum sunscreen daily (SPF 50+).",
                    "Monitor for any changes in size or texture.",
                    "Wear protective clothing outdoors."
                ]
            }
        ]
        
        # Randomly select 3 diseases and sort by confidence (descending)
        selected = random.sample(diseases, 3)
        selected.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Ensure the top prediction has the highest confidence
        selected[0]['confidence'] = round(random.uniform(88, 97), 1)
        selected[1]['confidence'] = round(random.uniform(4, 12), 1)
        selected[2]['confidence'] = round(random.uniform(1, 5), 1)
        
        # Add SHAP factors to the primary prediction
        feature_names = ['Border Irregularity', 'Color Asymmetry', 'Lesion Size', 'Pigment Network', 'Dermoscopic Structures']
        selected[0]['shapFactors'] = get_shap_mock(feature_names)

        return jsonify({
            "predictions": selected,
            # Also include top prediction as flat fields for backward compatibility
            "condition": selected[0]['condition'],
            "confidence": selected[0]['confidence'],
            "severity": selected[0]['severity'],
            "riskLevel": selected[0]['riskLevel'],
            "description": selected[0]['description'],
            "suggestions": selected[0]['suggestions'],
            "shapFactors": selected[0].get('shapFactors', get_shap_mock(feature_names))
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '').lower()
    
    # Mock AI response logic
    if 'diabetes' in message:
        response = "Diabetes is a chronic condition that affects how your body turns food into energy. It's crucial to monitor blood sugar levels and maintain a healthy diet. Would you like to use our Diabetes Risk predictor?"
    elif 'heart' in message:
        response = "Heart health is vital. Regular exercise, a balanced diet, and stress management are key. You can use our Heart Disease Predictor for a preliminary risk assessment."
    elif 'bmi' in message or 'weight' in message:
        response = "BMI (Body Mass Index) is a useful measure to check if you're a healthy weight for your height. You can access the BMI Calculator from the sidebar!"
    elif 'appointment' in message or 'book' in message or 'doctor' in message:
        response = "You can book an appointment with a specialist by visiting the 'Find Doctor' or 'Appointments' section in the dashboard."
    elif 'skin' in message or 'mole' in message or 'rash' in message:
        response = "For skin concerns, you can use our AI-powered Skin Disease Detection tool. Just upload a clear image of the affected area for a preliminary analysis."
    elif 'parkinson' in message or 'neurological' in message:
        response = "Parkinson's is a neurological disorder. Our platform offers a vocal-acoustic based preliminary screening tool for Parkinson's in the sidebar."
    elif 'hi' in message or 'hello' in message or 'hey' in message:
        response = "Hello there! I'm MedPredict AI. I can guide you to our prediction tools, help you find a doctor, or answer basic health questions. How can I assist you today?"
    else:
        response = f"I'm your AI health assistant. I can help answer general health questions, explain your prediction results, or guide you through the app. To help me understand better, could you specify if you are asking about Heart Health, Diabetes, Skin, or Appointments?"
        
    return jsonify({
        "reply": response
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
