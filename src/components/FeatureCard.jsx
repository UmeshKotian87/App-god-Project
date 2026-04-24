import './FeatureCard.css';

export default function FeatureCard({ icon: Icon, title, description, color, delay }) {
  return (
    <div 
      className="feature-card glass-panel animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="feature-icon-wrapper" style={{ background: color }}>
        <Icon size={24} className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <button className="feature-btn">
        Access Tool
        <span className="btn-arrow">→</span>
      </button>
    </div>
  );
}
