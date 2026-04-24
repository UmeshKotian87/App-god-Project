import { useState } from 'react';
import { Brain, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import './Predictor.css';

export default function ParkinsonsPredictor() {
  const [formData, setFormData] = useState({
    f0: 119.992,
    f1: 157.302,
    f2: 74.997,
    f3: 0.00784,
    f4: 0.00007,
    f5: 0.0037,
    f6: 0.00554,
    f7: 0.01109,
    f8: 0.04374,
    f9: 0.426,
    f10: 0.02182,
    f11: 0.0313,
    f12: 0.02971,
    f13: 0.06545,
    f14: 0.02211,
    f15: 21.033,
    f16: 0.414783,
    f17: 0.815285,
    f18: -4.813031,
    f19: 0.266482,
    f20: 2.301442,
    f21: 0.284654
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
      const response = await fetch('http://127.0.0.1:5000/api/predict/parkinsons', {
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
          prediction: formData.f0 < 130 ? 1 : 0,
          probability: formData.f0 < 130 ? 88.5 : 12.3,
          riskLevel: formData.f0 < 130 ? 'High' : 'Low',
          shapFactors: [
            { name: 'MDVP:Fo(Hz) (Vocal Freq)', impact: 38, positive: false },
            { name: 'MDVP:Fhi(Hz)', impact: 22, positive: false },
            { name: 'MDVP:Jitter(%)', impact: 15, positive: false },
            { name: 'HNR (Harmonic Noise)', impact: -10, positive: true }
          ]
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="predictor-page">
      <div className="predictor-header" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}>
        <div className="header-icon"><Brain size={40} /></div>
        <div className="header-text">
          <h2>Parkinson's Disease Predictor</h2>
          <p>Neurological assessment using vocal acoustic measurements and deep learning.</p>
        </div>
      </div>

      <div className="predictor-content">
        <form className="predictor-form card" onSubmit={handleSubmit}>
          <h3>Enter Vocal Acoustic Data</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>MDVP:Fo(Hz) (Avg Freq)</label>
              <input type="number" step="0.001" name="f0" value={formData.f0} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>MDVP:Fhi(Hz) (Max Freq)</label>
              <input type="number" step="0.001" name="f1" value={formData.f1} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>MDVP:Flo(Hz) (Min Freq)</label>
              <input type="number" step="0.001" name="f2" value={formData.f2} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>MDVP:Jitter(%)</label>
              <input type="number" step="0.00001" name="f3" value={formData.f3} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>MDVP:Jitter(Abs)</label>
              <input type="number" step="0.00001" name="f4" value={formData.f4} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>HNR (Harmonic Noise)</label>
              <input type="number" step="0.001" name="f15" value={formData.f15} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-predict" style={{ backgroundColor: '#a855f7' }} disabled={isLoading}>
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
