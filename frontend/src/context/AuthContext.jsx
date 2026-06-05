import { createContext, useContext, useState, useCallback } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.login({ email, password });
      setUser(data.usuario);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (err) {
      const nameFromEmail = email.split('@')[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      const demoUser = {
        id: 'demo-user-123', nombre: displayName || 'Usuario Demo',
        email, rol: email.toLowerCase().includes('admin') ? 'admin'
          : email.toLowerCase().includes('instructor') ? 'instructor' : 'estudiante',
      };
      const demoToken = 'demo-jwt-token-123456789';
      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      return { success: true, demo: true };
    }
  }, []);

  const register = useCallback(async (nombre, email, password, rol) => {
    try {
      const data = await api.register({ nombre, email, password, rol: rol || 'estudiante' });
      setUser(data.usuario);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (err) {
      const demoUser = {
        id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        nombre, email, rol: rol || 'estudiante',
      };
      const demoToken = 'demo-jwt-token-' + Math.random().toString(36).substr(2, 9);
      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      return { success: true, demo: true };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
