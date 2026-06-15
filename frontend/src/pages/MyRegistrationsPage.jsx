import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, Inbox, ArrowRight, Trash2 } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
];

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    api.get('/api/my-registrations/')
      .then(r => setRegistrations(r.data))
      .catch(() => setError('Failed to load registrations.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelRegister = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }
    setCancellingId(eventId);
    setError('');
    try {
      await api.delete(`/api/events/${eventId}/register/`);
      setRegistrations(prev => prev.filter(r => r.event.id !== eventId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">My Registered Events</h1>
        {!loading && <span className="section-badge">{registrations.length} registration{registrations.length !== 1 ? 's' : ''}</span>}
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {loading ? (
        <div className="loading-container"><div className="spinner" /><p>Loading your schedule...</p></div>
      ) : registrations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Inbox size={32} /></div>
          <h3 className="empty-state-title">No Registrations Yet</h3>
          <p className="empty-state-desc">You haven't signed up for any events. Browse and join something exciting!</p>
          <Link to="/events" className="btn btn-primary">Explore Events</Link>
        </div>
      ) : (
        <div className="grid">
          {registrations.map((reg, i) => {
            const event = reg.event;
            return (
              <div className="event-card anim-fade" key={reg.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="event-banner" style={{ background: GRADIENTS[(event.id - 1) % GRADIENTS.length] }}>
                  {event.title.charAt(0)}
                </div>
                <div className="event-body">
                  <span className="event-tag" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
                    ✓ Registered
                  </span>
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-desc">{event.description}</p>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="event-meta-item">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <Link to={`/events/${event.id}`} className="btn btn-secondary flex-align" style={{ flex: 1, justifyContent: 'center' }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                    <button 
                      onClick={() => handleCancelRegister(event.id, event.title)} 
                      disabled={cancellingId === event.id}
                      className="btn btn-danger flex-align"
                      style={{ padding: '0.55rem 0.9rem', flexShrink: 0 }}
                      title="Cancel Registration"
                    >
                      {cancellingId === event.id ? '...' : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;