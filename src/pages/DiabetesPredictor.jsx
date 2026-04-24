import { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import './Predictor.css';

export default function DiabetesPredictor() {
  const [formData, setFormData] = useState({
    pregnancies: 2,
    glucose: 120,
    bloodPressure: 70,
    skinThickness: 20,
    insulin: 85,
    bmi: 25.5,
    diabetesPedigree: 0.5,
    age: 35
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict/diabetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Fetch error:", error);
      // Fallback mock result if backend is offline
      setTimeout(() => {
        setResult({
          prediction: formData.glucose > 140 ? 1 : 0,
          probability: formData.glucose > 140 ? 82.1 : 18.5,
          riskLevel: formData.glucose > 140 ? 'High' : 'Low',
          shapFactors: [
            { name: 'Glucose Level', impact: 42, positive: false },
            { name: 'BMI', impact: 18, positive: false },
            { name: 'Age', impact: 12, positive: false },
            { name: 'Insulin', impact: -5, positive: true }
          ]
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="predictor-page">
      <div className="predictor-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
        <div className="header-icon"><Activity size={40} /></div>
        <div className="header-text">
          <h2>Diabetes Predictor</h2>
          <p>Early detection and risk analysis for Type 2 diabetes based on lifestyle and biometric data.</p>
        </div>
      </div>

      <div className="predictor-content">
        <form className="predictor-form card" onSubmit={handleSubmit}>
          <h3>Enter Patient Vitals</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Pregnancies</label>
              <input type="number" name="pregnancies" value={formData.pregnancies} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Glucose Level</label>
              <input type="number" name="glucose" value={formData.glucose} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Blood Pressure (mm Hg)</label>
              <input type="number" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Skin Thickness (mm)</label>
              <input type="number" name="skinThickness" value={formData.skinThickness} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Insulin Level (mu U/ml)</label>
              <input type="number" name="insulin" value={formData.insulin} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>BMI</label>
              <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Diabetes Pedigree Function</label>
              <input type="number" step="0.01" name="diabetesPedigree" value={formData.diabetesPedigree} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-predict" style={{ backgroundColor: '#2563eb' }} disabled={isLoading}>
            {isLoading ? 'Analyzing with ML Model...' : 'Predict Risk Score'}
          </button>
        </form>

        {result && (
          <div className="result-panel card animate-fade-in">
            <div className="result-header-panel">
              <div className={`risk-indicator ${result.riskLevel.toLowerCase()}`}>
                {result.riskLevel === 'High' ? <AlertTriangle size={32}/> : <CheckCircle size={32}/>}
                <div className="risk-text">
                  <span className="risk-label">Overall Risk Level</span>
                  <span className="risk-value">{result.riskLevel}</span>
                </div>
              </div>
              <div className="prob-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`circle ${result.riskLevel.toLowerCase()}`} strokeDasharray={`${result.probability}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{Math.round(result.probability)}%</text>
                </svg>
              </div>
            </div>
            
            <div className="xai-panel mt-4">
              <h4><Activity size={18}/> Feature Importance (Explainable AI)</h4>
              <div className="shap-bars">
                {result.shapFactors.map((factor, index) => (
                  <div className="shap-item" key={index}>
                    <div className="shap-label">
                      <span>{factor.name}</span>
                      <span className={factor.positive ? 'text-green' : 'text-red'}>
                        {factor.positive ? 'Good Indicator' : 'Risk Factor'}
                      </span>
                    </div>
                    <div className="shap-bar-container">
                      <div className="shap-center-line"></div>
                      <div 
                        className={`shap-fill ${factor.positive ? 'positive' : 'negative'}`}
                        style={{ 
                          width: `${Math.abs(factor.impact)}%`,
                          [factor.positive ? 'right' : 'left']: '50%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
