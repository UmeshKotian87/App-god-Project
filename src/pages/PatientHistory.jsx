import { useState, useEffect } from 'react';
import { History, Calendar, ShieldAlert, ChevronRight, Activity, Trash2 } from 'lucide-react';
import './PatientHistory.css';

export default function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('medpredict_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    if(window.confirm("Are you sure you want to clear all patient history?")) {
      localStorage.removeItem('medpredict_history');
      setHistory([]);
    }
  };

  const getSeverityBadge = (sev) => {
    if(sev === 'Mild') return <span className="hist-badge green">Mild</span>;
    if(sev === 'Moderate') return <span className="hist-badge yellow">Moderate</span>;
    if(sev === 'Severe') return <span className="hist-badge red">Severe</span>;
    return <span className="hist-badge green">Mild</span>;
  };

  return (
    <div className="patient-history-page">
      <div className="history-header">
        <div className="title-area">
          <h2><History /> Patient History Dashboard</h2>
          <p>Review past diagnostic scans and track condition progression over time.</p>
        </div>
        {history.length > 0 && (
          <button className="btn-clear" onClick={clearHistory}>
            <Trash2 size={16} /> Clear Records
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <Activity size={48} className="empty-icon" />
          <h3>No Records Found</h3>
          <p>Your previous scan results will appear here automatically.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((record, index) => (
            <div className="history-card animate-fade-in" key={record.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="hist-image-container">
                <img src={record.image} alt="Scan Result" />
                <div className="hist-date"><Calendar size={12}/> {record.date}</div>
              </div>
              <div className="hist-content">
                <div className="hist-row">
                  <span className="hist-disease">{record.disease}</span>
                  {getSeverityBadge(record.severity)}
                </div>
                
                <div className="hist-confidence">
                  <div className="hc-header">
                    <span>AI Confidence</span>
                    <span>{record.confidence}%</span>
                  </div>
                  <div className="hc-track">
                    <div className="hc-fill" style={{ width: `${record.confidence}%` }}></div>
                  </div>
                </div>
                
                <button className="btn-view-details">
                  View Full Report <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="privacy-notice mt-auto">
        <ShieldAlert size={16} />
        <span><strong>Secure Storage:</strong> Your medical records are stored locally on your device and are never sent to external servers.</span>
      </div>
    </div>
  );
}
