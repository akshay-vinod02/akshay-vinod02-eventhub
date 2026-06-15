import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, MapPin, AlertCircle, CheckCircle2, ArrowLeft, Ticket, Trash2 } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#6366f1)',
  'linear-gradient(135deg,#10b981,#0ea5e9)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#14b8a6,#6366f1)',
  'linear-gradient(135deg,#f43f5e,#ec4899)',
  'linear-gradient(135deg,#a855f7,#06b6d4)',
];

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isRegistered, setReg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const eRes = await api.get(`/api/events/${id}/`);
        setEvent(eRes.data);
        if (user) {
          const mRes = await api.get('/api/my-registrations/');
          setReg(mRes.data.some(r => r.event.id === parseInt(id)));
        }
      } catch {
        setMessage({ text: 'Failed to load event.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRegistering(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post(`/api/events/${id}/register/`);
      setReg(true);
      setMessage({ text: '🎉 You have successfully registered for this event!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Registration failed.', type: 'error' });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegister = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }
    setRegistering(true);
    setMessage({ text: '', type: '' });
    try {
      await api.delete(`/api/events/${id}/register/`);
      setReg(false);
      setMessage({ text: 'Registration cancelled successfully.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to cancel registration.', type: 'error' });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={28} />
          </div>
          <h3 className="empty-state-title">Event Not Found</h3>
          <p className="empty-state-desc">This event doesn't exist or has been removed.</p>
          <Link to="/events" className="btn btn-secondary">Back to Events</Link>
        </div>
      </div>
    );
  }

  const grad = GRADIENTS[(parseInt(id) - 1) % GRADIENTS.length];

  return (
    <div className="container anim-fade">
      <Link to="/events" className="btn btn-secondary flex-align" style={{ marginBottom: '1.75rem' }}>
        <ArrowLeft size={15} /> Back to Events
      </Link>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="details-hero" style={{ background: grad }}>
        <h1 className="details-hero-title">{event.title}</h1>
        <div className="details-hero-meta">
          <span className="flex-align">
            <Calendar size={16} />
            {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex-align">
            <MapPin size={16} />
            {event.location}
          </span>
        </div>
      </div>

      <div className="event-details-layout">
        <div className="details-content-card">
          <h2 className="details-section-title">About This Event</h2>
          <p className="details-desc">{event.description}</p>
        </div>

        <div className="details-sidebar-card">
          <div className="sidebar-price">
            <p className="sidebar-price-label">Admission</p>
            <p className="sidebar-price-value">Free</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="event-meta-item">
              <Calendar size={14} />
              <span style={{ fontSize: '0.85rem', color: 'var(--tx-3)' }}>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="event-meta-item">
              <MapPin size={14} />
              <span style={{ fontSize: '0.85rem', color: 'var(--tx-3)' }}>{event.location}</span>
            </div>
          </div>

          {isRegistered ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div className="btn btn-secondary" style={{ width: '100%', cursor: 'default', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'var(--ok-bg)', justifyContent: 'center' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--ok)' }} /> Already Registered
              </div>
              <button onClick={handleCancelRegister} disabled={registering} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <Trash2 size={16} />
                {registering ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          ) : (
            <button onClick={handleRegister} disabled={registering} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Ticket size={16} />
              {registering ? 'Registering...' : user ? 'Register for Event' : 'Login to Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;