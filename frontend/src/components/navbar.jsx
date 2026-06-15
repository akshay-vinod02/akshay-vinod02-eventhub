import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Calendar, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/events" className="nav-brand">
        <Calendar size={22} />
        EventHub
      </Link>

      <ul className="nav-links">
        <li>
          <NavLink to="/events" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            Events
          </NavLink>
        </li>
        {user && (
          <li>
            <NavLink to="/my-registrations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              My Registrations
            </NavLink>
          </li>
        )}
      </ul>

      <div className="nav-actions">
        <button onClick={() => setDarkMode(d => !d)} className="btn btn-icon-only" aria-label="Toggle theme">
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user ? (
          <div className="flex-align" style={{ gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--tx-3)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              padding: '0.35rem 0.875rem',
              borderRadius: 'var(--pill)',
              maxWidth: 160,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user.name}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary flex-align">
              <LogOut size={15} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex-align">
            <Link to="/login" className="btn btn-secondary flex-align">
              <LogIn size={15} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary flex-align">
              <UserPlus size={15} /> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
