import { useState } from 'react';
import './BMICalculator.css';

export default function BMICalculator() {
  const [metric, setMetric] = useState(true);
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(45);
  const [age, setAge] = useState(21);
  const [gender, setGender] = useState('Male');
  const [showResult, setShowResult] = useState(false);

  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
  
  let status = 'Normal';
  let badgeColor = '#10b981';
  if (bmi < 18.5) { status = 'Underweight'; badgeColor = '#f59e0b'; }
  else if (bmi >= 25 && bmi < 30) { status = 'Overweight'; badgeColor = '#f59e0b'; }
  else if (bmi >= 30) { status = 'Obese'; badgeColor = '#ef4444'; }

  const handleCalculate = () => {
    setShowResult(false);
    setTimeout(() => setShowResult(true), 100); // trigger animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bmi-page">
      <div className="bmi-header-title">
        <h2>BMI Calculator</h2>
        <p>Calculate your Body Mass Index (BMI) and find out where you stand.</p>
      </div>

      {showResult && (
        <div className="bmi-results-container animate-fade-in">
          <div className="bmi-result-card">
            <div className="bmi-result-content">
              <h3>Your BMI Result</h3>
              <div className="bmi-score">{bmi}</div>
              <div className="bmi-badge" style={{ backgroundColor: badgeColor }}>{status}</div>
            </div>
            <div className="bmi-result-figure">
              <div className="figure-icon">🧍</div>
            </div>
            
            <div className="bmi-result-footer">
              <div className="footer-item">
                <span className="footer-label">HEIGHT</span>
                <span className="footer-value">{height} cm</span>
              </div>
              <div className="footer-divider"></div>
              <div className="footer-item">
                <span className="footer-label">WEIGHT</span>
                <span className="footer-value">{weight}.0 kg</span>
              </div>
            </div>
          </div>

          <div className="bmi-suggestions-card card">
            <h3>Personalized Recommendations</h3>
            <div className="suggestions-list">
              {status === 'Underweight' && (
                <>
                  <p className="suggestion-intro">You are below the healthy weight range. It's recommended to gain some weight safely.</p>
                  <ul>
                    <li><strong>Caloric Surplus:</strong> Aim to eat 300-500 calories more than you burn daily.</li>
                    <li><strong>Nutrient-Dense Foods:</strong> Add nuts, avocados, olive oil, and whole grains to your meals.</li>
                    <li><strong>Protein:</strong> Eat plenty of protein (lean meats, eggs, dairy) to build muscle mass, not just fat.</li>
                    <li><strong>Strength Training:</strong> Light weightlifting can help convert extra calories into muscle.</li>
                  </ul>
                </>
              )}
              {status === 'Normal' && (
                <>
                  <p className="suggestion-intro">Great job! You are within the healthy weight range. The goal is to maintain your current status.</p>
                  <ul>
                    <li><strong>Maintenance:</strong> Keep eating a balanced diet with your current caloric intake.</li>
                    <li><strong>Stay Active:</strong> Aim for at least 150 minutes of moderate aerobic activity weekly.</li>
                    <li><strong>Hydration:</strong> Drink at least 8 glasses of water a day to keep your metabolism healthy.</li>
                    <li><strong>Regular Checkups:</strong> Continue monitoring your weight occasionally to prevent unwanted fluctuations.</li>
                  </ul>
                </>
              )}
              {status === 'Overweight' && (
                <>
                  <p className="suggestion-intro">You are slightly above the healthy weight range. Small lifestyle changes can make a big difference.</p>
                  <ul>
                    <li><strong>Caloric Deficit:</strong> Try reducing your daily intake by 300-500 calories to lose weight safely.</li>
                    <li><strong>Portion Control:</strong> Use smaller plates and avoid second helpings to naturally cut calories.</li>
                    <li><strong>More Veggies:</strong> Fill half your plate with vegetables; they are filling but low in calories.</li>
                    <li><strong>Cardio Exercise:</strong> Increase your daily steps and try jogging, swimming, or cycling to burn fat.</li>
                  </ul>
                </>
              )}
              {status === 'Obese' && (
                <>
                  <p className="suggestion-intro">Your weight is in a range that may increase the risk of health issues. A structured plan is recommended.</p>
                  <ul>
                    <li><strong>Consult a Doctor:</strong> Consider speaking with a healthcare provider or nutritionist for a safe, tailored plan.</li>
                    <li><strong>Cut Processed Sugars:</strong> Dramatically reduce sugary drinks, candies, and highly processed foods.</li>
                    <li><strong>Consistent Deficit:</strong> Aim for a steady deficit of 500 calories per day. Focus on long-term habits, not crash diets.</li>
                    <li><strong>Low-Impact Exercise:</strong> Start with walking, water aerobics, or elliptical machines to protect your joints while moving.</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bmi-form-card">
        <h3>Enter Your Measurements</h3>
        
        <div className="unit-toggle">
          <button className={`unit-btn ${metric ? 'active' : ''}`} onClick={() => setMetric(true)}>Metric (kg, cm)</button>
          <button className={`unit-btn ${!metric ? 'active' : ''}`} onClick={() => setMetric(false)}>Imperial (lb, ft-in)</button>
        </div>

        <div className="form-group">
          <div className="form-group-header">
            <label>📏 Height</label>
            <div className="input-with-unit">
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              <span>cm</span>
            </div>
          </div>
          <input type="range" min="120" max="220" value={height} onChange={(e) => setHeight(e.target.value)} className="slider-input" />
          <div className="slider-labels">
            <span>120 cm</span>
            <span>220 cm</span>
          </div>
        </div>

        <div className="form-group">
          <div className="form-group-header">
            <label>⚖️ Weight</label>
            <div className="input-with-unit">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <span>kg</span>
            </div>
          </div>
          <input type="range" min="20" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="slider-input" />
          <div className="slider-labels">
            <span>20 kg</span>
            <span>200 kg</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>👤 Age</label>
            <div className="input-with-unit">
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              <span>yrs</span>
            </div>
          </div>
          <div className="form-group half">
            <label>⚥ Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="gender-select">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <button className="calculate-btn" onClick={handleCalculate}>Calculate BMI</button>
      </div>
      
      <div className="info-box">
        <div className="info-icon">ℹ️</div>
        <div className="info-text">
          <h4>What is BMI (Body Mass Index)?</h4>
          <p>BMI is a measure of body fat based on height and weight that applies to adult men and women. It is used to screen for weight categories.</p>
        </div>
      </div>
    </div>
  );
}
