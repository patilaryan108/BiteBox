import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'navbar-role admin';
    if (role === 'shopkeeper') return 'navbar-role shopkeeper';
    return 'navbar-role customer';
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'shopkeeper') return '/shopkeeper';
    return '/';
  };

  return (
    <nav className="bb-navbar" style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none' }}>
      {/* Logo */}
      <a href="/" className="bb-navbar__logo">
        BITE<span>BOX</span>
      </a>

      {/* Nav Links */}
      <ul className="bb-navbar__links">
        <li><a href="/">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#lunch">Lunch</a></li>
        <li><a href="#dairy">Dairy</a></li>
        <li><a href="#veggies">Vegetables</a></li>
        {user?.role === 'admin' && (
          <li><Link to="/admin" className="navbar-dashboard-link">⚙️ Admin</Link></li>
        )}
        {user?.role === 'shopkeeper' && (
          <li><Link to="/shopkeeper" className="navbar-dashboard-link">🏪 Dashboard</Link></li>
        )}
      </ul>

      {/* Right side: Search + Cart + Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className="bb-navbar__search"
          onClick={() => navigate('/search')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search dishes…" readOnly style={{ cursor: 'pointer' }} />
        </div>

        {user ? (
          /* Logged-in user menu */
          <div className="navbar-user-menu" style={{ position: 'relative' }}>
            <button
              id="navbar-user-btn"
              className="navbar-user-btn"
              onClick={() => setMenuOpen(v => !v)}
            >
              <span className="navbar-avatar">
                {user.role === 'admin' ? '👑' : user.role === 'shopkeeper' ? '🏪' : '👤'}
              </span>
              <span className="navbar-username">{user.name?.split(' ')[0]}</span>
              <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
              <span style={{ fontSize: '0.75rem' }}>▾</span>
            </button>

            {menuOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                {(user.role === 'admin' || user.role === 'shopkeeper') && (
                  <button
                    id="navbar-dashboard-link"
                    className="navbar-dropdown-item"
                    onClick={() => { navigate(getDashboardPath(user.role)); setMenuOpen(false); }}
                  >
                    {user.role === 'admin' ? '⚙️ Admin Dashboard' : '🏪 My Dashboard'}
                  </button>
                )}
                <button
                  id="navbar-logout-btn"
                  className="navbar-dropdown-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Not logged in */
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              id="navbar-signin-link"
              to="/signin"
              className="navbar-auth-btn signin"
            >
              Sign In
            </Link>
            <Link
              id="navbar-signup-link"
              to="/signup"
              className="navbar-auth-btn signup"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;