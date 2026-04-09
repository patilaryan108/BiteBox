import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'shopkeeper') navigate('/shopkeeper');
      else navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">BITE<span>BOX</span></div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of food lovers today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">👤</span>
              <input
                id="signup-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">✉️</span>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">🔒</span>
              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-role">I am a…</label>
            <div className="auth-role-group">
              {['customer', 'shopkeeper'].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`auth-role-btn${form.role === r ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, role: r })}
                  id={`role-${r}`}
                >
                  {r === 'customer' ? '🛍️ Customer' : '🏪 Shopkeeper'}
                </button>
              ))}
            </div>
          </div>

          <button
            id="signup-submit"
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
