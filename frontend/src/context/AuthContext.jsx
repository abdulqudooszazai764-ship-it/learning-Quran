import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem('academy_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await client.get('/auth/me');
      setUser(res.data.user);
      setFamily(res.data.family);
    } catch (err) {
      localStorage.removeItem('academy_token');
      setUser(null);
      setFamily(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function login(email, password) {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('academy_token', res.data.token);
    setUser(res.data.user);
    await loadMe();
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem('academy_token');
    setUser(null);
    setFamily(null);
  }

  return (
    <AuthContext.Provider value={{ user, family, loading, login, logout, reload: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
