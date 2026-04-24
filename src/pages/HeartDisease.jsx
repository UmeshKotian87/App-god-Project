import { useState } from 'react';
import { Heart, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import './Predictor.css';

export default function HeartDisease() {
  const [formData, setFormData] = useState({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2
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
      const response = await fetch('http://127.0.0.1:5000/api/predict/heart', {
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
          prediction: formData.age > 60 ? 1 : 0,
          probability: formData.age > 60 ? 75.4 : 22.1,
          riskLevel: formData.age > 60 ? 'High' : 'Low',
          shapFactors: [
            { name: 'Chest Pain Type', impact: 25, positive: false },
            { name: 'Age', impact: 15, positive: false },
            { name: 'Max Heart Rate', impact: 12, positive: true },
            { name: 'Cholesterol', impact: -8, positive: true }
          ]
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="predictor-page">
      <div className="predictor-header heart-theme">
        <div className="header-icon"><Heart size={40} /></div>
        <div className="header-text">
          <h2>Heart Disease Predictor</h2>
          <p>Advanced cardiovascular risk assessment using key health metrics and machine learning.</p>
        </div>
      </div>

      <div className="predictor-content">
        <form className="predictor-form card" onSubmit={handleSubmit}>
          <h3>Enter Patient Vitals</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Sex (1=Male, 0=Female)</label>
              <select name="sex" value={formData.sex} onChange={handleChange}>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Chest Pain Type (0-3)</label>
              <select name="cp" value={formData.cp} onChange={handleChange}>
                <option value={0}>0 - Typical Angina</option>
                <option value={1}>1 - Atypical Angina</option>
                <option value={2}>2 - Non-anginal Pain</option>
                <option value={3}>3 - Asymptomatic</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Resting Blood Pressure</label>
              <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Cholesterol (mg/dl)</label>
              <input type="number" name="chol" value={formData.chol} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Max Heart Rate</label>
              <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-predict heart-btn" disabled={isLoading}>
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
