import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Bell, Check, Trash2, Pill } from 'lucide-react';
import './MedicineCalendar.css';

export default function MedicineCalendar() {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Amoxicillin', dosage: '500mg', time: '08:00', taken: false },
    { id: 2, name: 'Vitamin D3', dosage: '1000 IU', time: '13:30', taken: false }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check for alerts every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const currentHourStr = now.getHours().toString().padStart(2, '0');
      const currentMinStr = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${currentHourStr}:${currentMinStr}`;
      
      medications.forEach(med => {
        if (med.time === timeString && !med.taken) {
          // Play a simple alert sound if available
          try {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Medication Reminder", {
                body: `It's time to take your ${med.name} (${med.dosage})`,
                icon: "/vite.svg"
              });
            } else if ("Notification" in window && Notification.permission !== "denied") {
              Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                  new Notification("Medication Reminder", { body: `Time for ${med.name}` });
                }
              });
            }
          } catch(e) {}
          
          alert(`⏰ MEDICINE ALERT!\n\nIt's time to take your medication:\n${med.name} - ${med.dosage}\n\nTime: ${med.time}`);
        }
      });
    }, 60000); // Check every minute

    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => clearInterval(timer);
  }, [medications]);

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.time) return;
    
    setMedications([...medications, { 
      id: Date.now(), 
      ...newMed, 
      taken: false 
    }]);
    setNewMed({ name: '', dosage: '', time: '' });
    setShowAddForm(false);
  };

  const toggleTaken = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const deleteMed = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  // Sort medications by time
  const sortedMeds = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="medicine-page">
      <div className="page-header medicine-theme">
        <h2><Calendar size={28} /> Medication Calendar & Alerts</h2>
        <p>Schedule your daily medicines and get notified when it's time to take them.</p>
      </div>

      <div className="medicine-content">
        <div className="med-panel card">
          <div className="panel-header">
            <h3>Today's Schedule</h3>
            <button className="btn-primary small" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : <><Plus size={16} /> Add Medicine</>}
            </button>
          </div>

          {showAddForm && (
            <form className="add-med-form animate-fade-in" onSubmit={handleAddMed}>
              <div className="form-group">
                <label>Medicine Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paracetamol" 
                  value={newMed.name} 
                  onChange={e => setNewMed({...newMed, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1 Pill, 500mg" 
                  value={newMed.dosage} 
                  onChange={e => setNewMed({...newMed, dosage: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  value={newMed.time} 
                  onChange={e => setNewMed({...newMed, time: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn-save">Save Schedule</button>
            </form>
          )}

          <div className="med-list">
            {sortedMeds.length === 0 ? (
              <div className="empty-state">
                <Pill size={48} opacity={0.2} />
                <p>No medications scheduled for today.</p>
              </div>
            ) : (
              sortedMeds.map(med => (
                <div key={med.id} className={`med-item ${med.taken ? 'taken' : ''}`}>
                  <div className="med-time">
                    <Clock size={16} />
                    <span>{med.time}</span>
                  </div>
                  
                  <div className="med-details">
                    <h4>{med.name}</h4>
                    <p>{med.dosage}</p>
                  </div>
                  
                  <div className="med-actions">
                    <button 
                      className={`btn-taken ${med.taken ? 'active' : ''}`}
                      onClick={() => toggleTaken(med.id)}
                      title={med.taken ? "Mark as not taken" : "Mark as taken"}
                    >
                      <Check size={20} />
                    </button>
                    <button className="btn-delete" onClick={() => deleteMed(med.id)} title="Remove medicine">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="side-panel">
          <div className="clock-card card">
            <Clock size={24} className="text-blue" />
            <div className="current-time">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p>Keep this app open in a tab to receive desktop notifications and alerts when it's time to take your medicine.</p>
          </div>
          
          <div className="alert-info card">
            <div className="info-header">
              <Bell size={20} className="text-yellow" />
              <h4>How Alerts Work</h4>
            </div>
            <ul>
              <li>Add your medicine and the exact time you need to take it.</li>
              <li>When the time arrives, a browser popup alert will notify you.</li>
              <li>If you allow notifications, you'll also get a system popup!</li>
              <li>Click the green checkmark once you've taken your pill.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
