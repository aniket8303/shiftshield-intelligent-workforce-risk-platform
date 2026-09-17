import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to normalize role
  const normalizeRole = (rawRole) => {
    if (!rawRole) return null;
    let normalized = rawRole.toUpperCase();
    if (normalized.startsWith('ROLE_')) {
      normalized = normalized.substring(5);
    }
    return normalized;
  };

  useEffect(() => {
    // Try to initialize user from localStorage if it exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    
    // Normalize role on load if exists
    if (role) {
      const normalized = normalizeRole(role);
      if (normalized !== role) {
        setRole(normalized);
        localStorage.setItem('role', normalized);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (newToken, rawUser) => {
    const normalizedRole = normalizeRole(rawUser.role);
    
    // Update state
    setToken(newToken);
    setRole(normalizedRole);
    setUser(rawUser);

    // Update localStorage
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
    <AuthContext.Provider value={{ token, role, user, login, logout, loading, normalizeRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
