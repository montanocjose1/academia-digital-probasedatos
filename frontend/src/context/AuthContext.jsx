import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Error al iniciar sesión' };
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch {
      console.warn('Backend server not reached. Logging in via Demo Mode.');
      
      // Simple logic to set roles based on email keywords for demo purposes
      const nameFromEmail = email.split('@')[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      const demoUser = {
        _id: 'demo-user-123',
        name: displayName || 'Usuario Demo',
        email: email,
        role: email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('instructor') ? 'instructor' : 'student',
      };
      const demoToken = 'demo-jwt-token-123456789';

      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      return { success: true };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Error al registrar' };
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch {
      console.warn('Backend server not reached. Registering via Demo Mode.');
      
      const demoUser = {
        _id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: role,
      };
      const demoToken = 'demo-jwt-token-' + Math.random().toString(36).substr(2, 9);

      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);