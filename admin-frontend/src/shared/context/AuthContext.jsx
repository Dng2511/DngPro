import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginAdmin as apiLoginAdmin, getProfile } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Try to refresh profile if token exists and user not set
  useEffect(() => {
    (async () => {
      if (token && !user) {
        try {
          const res = await getProfile();
          if (res && res.data && res.data.data) {
            setUser(res.data.data);
          }
        } catch (err) {
          // ignore
        }
      }
    })();
  }, []); // run once on mount

  const login = async (email, password) => {
    const res = await apiLoginAdmin({ email, password });
    if (res && res.data) {
      // backend returns { status, message, data: { ...user }, token }
      const tokenVal = res.data.token;
      const userVal = res.data.data;
      setToken(tokenVal || null);
      setUser(userVal || null);
      return res.data;
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
