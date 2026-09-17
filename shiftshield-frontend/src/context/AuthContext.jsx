import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;

    let normalized = rawRole.toUpperCase();

    if (normalized.startsWith('ROLE_')) {
      normalized = normalized.substring(5);
    }

    return normalized;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');

        const backendUser = response.data;
        const normalizedRole = normalizeRole(backendUser.role);

        setToken(storedToken);
        setRole(normalizedRole);
        setUser(backendUser);

        localStorage.setItem('role', normalizedRole);
        localStorage.setItem('user', JSON.stringify(backendUser));
      } catch (error) {
        console.error('Session verification failed:', error);

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        setToken(null);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken, rawUser) => {
    const normalizedRole = normalizeRole(rawUser.role);

    setToken(newToken);
    setRole(normalizedRole);
    setUser(rawUser);

    localStorage.setItem('token', newToken);
    localStorage.setItem('role', normalizedRole);
    localStorage.setItem('user', JSON.stringify(rawUser));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        login,
        logout,
        loading,
        normalizeRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};