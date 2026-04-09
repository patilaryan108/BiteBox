import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_BASE = 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bb_token');
    const savedUser = localStorage.getItem('bb_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    const res = await axios.post(`${API_BASE}/api/auth/signup`, {
      name, email, password, role,
    });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bb_token', newToken);
    localStorage.setItem('bb_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const signin = useCallback(async (email, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/signin`, { email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bb_token', newToken);
    localStorage.setItem('bb_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
  }, []);

  // Update user in state + localStorage (e.g. after shop registration)
  const updateUser = useCallback((newUser, newToken) => {
    setUser(newUser);
    localStorage.setItem('bb_user', JSON.stringify(newUser));
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('bb_token', newToken);
    }
  }, []);

  // Helper: axios instance with auth header
  const authAxios = useCallback(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, signin, logout, updateUser, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
