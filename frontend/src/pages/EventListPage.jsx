import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Calendar, ArrowRight, Frown, Zap } from 'lucide-react';

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

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const PAGE_SIZE = 6;

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/events/');
      setEvents(res.data);
    } catch {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Client-side filtering
  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  );

  // Client-side pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedEvents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container">
      {/* ── HERO ── */}
      <div className="hero-section anim-fade">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span />
            Kerala's Premier Event Platform
          </div>
          <h1 className="hero-title">
            Discover &amp; Join<br />
            <em>Amazing Events</em>
          </h1>
          <p className="hero-subtitle">
            Browse events happening across Kerala — from tech summits to art exhibitions.
            Register in seconds, for free.
          </p>

          <div className="hero-search">
            <Search className="hero-search-icon" size={17} />
            <input
              className="hero-search-input"
              type="text"
              placeholder="Search events or locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="hero-search-btn">Search</button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{filtered.length}</div>
              <div className="hero-stat-label">Events</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{new Set(events.map(e => e.location)).size || 8}</div>
              <div className="hero-stat-label">Cities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-label">Registration</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="section-header">
        <h2 className="section-title">
          <Zap size={20} style={{ color: 'var(--p1)' }} />
          Upcoming Events
        </h2>
        {!loading && (
          <span className="section-badge">{filtered.length} Events Found</span>
        )}
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Discovering events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Frown size={30} /></div>
          <h3 className="empty-state-title">No Events Found</h3>
          <p className="empty-state-desc">No events match your search. Try different keywords.</p>
          <button onClick={() => setSearch('')} className="btn btn-secondary">Clear Search</button>
        </div>
      ) : (
        <>
          <div className="grid">
            {paginatedEvents.map((ev, i) => (
              <div
                className="event-card anim-fade"
                key={ev.id}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="event-banner" style={{ background: GRADIENTS[(ev.id - 1) % GRADIENTS.length] }}>
                  <span className="event-banner-letter">{ev.title.charAt(0)}</span>
                  <span className="event-banner-title">{ev.location}</span>
                </div>
                <div className="event-body">
                  <span className="event-tag">
                    <span className="event-tag-dot" />
                    Upcoming
                  </span>
                  <h3 className="event-card-title">{ev.title}</h3>
                  <p className="event-card-desc">{ev.description}</p>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <Calendar size={13} />
                      {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="event-meta-item">
                      <MapPin size={13} />
                      {ev.location}
                    </div>
                  </div>
                  <Link
                    to={`/events/${ev.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1.25rem' }}
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button className="pagination-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventListPage;