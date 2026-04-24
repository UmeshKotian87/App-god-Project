import { useState } from 'react';
import { Search, MapPin, Calendar, Star, Filter } from 'lucide-react';
import './FindDoctor.css';

export default function FindDoctor() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialty: 'Cardiologist',
      experience: '12 yrs',
      rating: 4.8,
      reviews: 124,
      tags: ['Cardiology', 'Heart Care', 'Preventive Cardiology'],
      hospital: 'Nepal Heart Institute',
      location: 'Durbarmarg, Kathmandu',
      available: 'Tomorrow, 10:00 AM',
      initials: 'SC',
      color: '#2563eb'
    },
    {
      id: 2,
      name: 'Dr. Rohan Jaiswal',
      specialty: 'Neurologist',
      experience: '9 yrs',
      rating: 4.7,
      reviews: 98,
      tags: ['Neurology', 'Headache', 'Stroke', 'Epilepsy'],
      hospital: 'Norvic International Hospital',
      location: 'Thapathali, Kathmandu',
      available: 'Today, 02:30 PM',
      initials: 'RJ',
      color: '#0284c7'
    },
    {
      id: 3,
      name: 'Dr. Merry Dongol',
      specialty: 'Dermatologist',
      experience: '8 yrs',
      rating: 4.6,
      reviews: 76,
      tags: ['Dermatology', 'Skin Treatment', 'Skin Care'],
      hospital: 'Grande International Hospital',
      location: 'Jamal, Kathmandu',
      available: 'Friday, 11:00 AM',
      initials: 'MD',
      color: '#0f766e'
    }
  ];

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="find-doctor-page">
      <div className="doctor-hero">
        <div className="doctor-hero-content">
          <h2>Doctor Finder</h2>
          <p>Search and book appointments with top specialists, hospitals & nearby clinics.</p>
        </div>
        <div className="doctor-hero-icon">
          <Search size={64} opacity={0.2} />
        </div>
      </div>

      <div className="search-filters">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, specialty, or symptoms" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdowns">
          <div className="dropdown">
            <MapPin size={18} />
            <select>
              <option>Select location</option>
              <option>Kathmandu</option>
              <option>Lalitpur</option>
              <option>Bhaktapur</option>
            </select>
          </div>
          
          <div className="dropdown">
            <Filter size={18} />
            <select>
              <option>All medical services</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Dermatology</option>
            </select>
          </div>
        </div>
      </div>

      <div className="doctors-list">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="doctor-card animate-fade-in">
            <div className="doctor-header">
              <div className="doctor-avatar" style={{ backgroundColor: doc.color }}>
                {doc.initials}
              </div>
              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <p className="specialty">{doc.specialty} • {doc.experience}</p>
                <div className="rating">
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <span className="rating-score">{doc.rating}</span>
                  <span className="rating-count">({doc.reviews})</span>
                </div>
              </div>
            </div>
            
            <div className="doctor-tags">
              {doc.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
            
            <div className="doctor-details">
              <div className="detail-item">
                <span className="detail-icon">🏥</span>
                <span>{doc.hospital}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} className="detail-icon" />
                <span>{doc.location}</span>
              </div>
              <div className="detail-item available">
                <span className="dot"></span>
                <span><strong>Available</strong> • {doc.available}</span>
              </div>
            </div>
            
            <div className="doctor-actions">
              <button className="btn-outline">View Profile</button>
              <button className="btn-primary" onClick={() => alert(`Appointment booked with ${doc.name} for ${doc.available}`)}>
                <Calendar size={16} />
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="support-banner">
        <div className="support-content">
          <h4>Need Further Assistance?</h4>
          <p>Our support team is available 24/7 to help you book appointments.</p>
          <button className="btn-outline bg-white mt-2">Chat Now</button>
        </div>
        <div className="support-icon">
          🎧
        </div>
      </div>
    </div>
  );
}
