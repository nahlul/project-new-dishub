import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, formatApiErrorDetail } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = checking, false = not authenticated, object = authenticated
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data);
    } catch (error) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await authAPI.login(username, password);
      setUser(data);
      return { success: true };
    } catch (error) {
      const errorMessage = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(false);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
