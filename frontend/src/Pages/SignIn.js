import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signin(form.email, form.password);
      const from = location.state?.from || (user.role === 'admin' ? '/admin' : user.role === 'shopkeeper' ? '/shopkeeper' : '/');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Check your credentials.');
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
        <div className="auth-logo">BITE<span>BOX</span></div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your BiteBox account</p>

        {/* Hint box for demo */}
        {/* <div className="auth-hint">
          <strong>Demo Admin:</strong> admin@bitebox.com / admin123
        </div> */}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="signin-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">✉️</span>
              <input
                id="signin-email"
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
            <label htmlFor="signin-password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">🔒</span>
              <input
                id="signin-password"
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="signin-submit"
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" state={{ from: location.state?.from }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
