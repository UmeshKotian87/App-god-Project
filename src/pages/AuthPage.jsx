import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Activity, ArrowRight, Sparkles } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !formData.name) {
      setError('Please enter your full name.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (!isLogin) {
        // Sign up — save user locally
        const users = JSON.parse(localStorage.getItem('medpredict_users') || '[]');
        const exists = users.find(u => u.email === formData.email);
        if (exists) {
          setError('An account with this email already exists. Please log in.');
          return;
        }
        users.push({ name: formData.name, email: formData.email, password: formData.password });
        localStorage.setItem('medpredict_users', JSON.stringify(users));
      } else {
        // Login — validate
        const users = JSON.parse(localStorage.getItem('medpredict_users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        if (!user && formData.email !== 'demo@medpredict.ai') {
          setError('Invalid email or password.');
          return;
        }
      }
      
      // Store session
      const userName = formData.name || formData.email.split('@')[0];
      localStorage.setItem('medpredict_session', JSON.stringify({ 
        name: userName, 
        email: formData.email, 
        loggedIn: true,
        loginTime: new Date().toISOString()
      }));
      
      onLogin({ name: userName, email: formData.email });
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-effects">
        <div className="auth-orb orb-1"></div>
        <div className="auth-orb orb-2"></div>
        <div className="auth-orb orb-3"></div>
      </div>

      <div className="auth-container animate-fade-in">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="auth-brand-content">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M12 22s-4-2-4-6 4-4 4-4-4-2-4-6 4-4 4-4" />
                </svg>
              </div>
              <div className="auth-logo-text">
                <span className="brand-med">Med</span><span className="brand-predict">Predict</span> <span className="brand-ai">AI</span>
              </div>
            </div>

            <h1>Your AI-Powered<br/>Health Companion</h1>
            <p>Predict diseases early. Track your health. Make informed decisions with cutting-edge machine learning.</p>

            <div className="auth-features">
              <div className="auth-feature-item">
                <Sparkles size={18} />
                <span>AI Disease Predictions</span>
              </div>
              <div className="auth-feature-item">
                <Activity size={18} />
                <span>Grad-CAM Visual Analysis</span>
              </div>
              <div className="auth-feature-item">
                <User size={18} />
                <span>Patient History Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div className="auth-tabs">
              <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>
                Log In
              </button>
              <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>
                Sign Up
              </button>
            </div>

            <h2>{isLogin ? 'Welcome back!' : 'Create your account'}</h2>
            <p className="auth-subtitle">
              {isLogin ? 'Enter your credentials to access your health dashboard.' : 'Join thousands using AI for smarter healthcare.'}
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-input-icon" />
                    <input 
                      type="text" 
                      placeholder="Dr. John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="auth-options">
                  <label className="auth-remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="auth-forgot">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="auth-spinner"></div>
                ) : (
                  <>
                    {isLogin ? 'Log In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <button className="auth-social-btn" onClick={() => { 
                localStorage.setItem('medpredict_session', JSON.stringify({ name: 'Demo User', email: 'demo@medpredict.ai', loggedIn: true }));
                onLogin({ name: 'Demo User', email: 'demo@medpredict.ai' }); 
              }}>
                🚀 Quick Demo Access
              </button>
            </div>

            <p className="auth-footer-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button className="auth-switch-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
