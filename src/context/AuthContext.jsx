'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ideavault_token';
const USER_KEY = 'ideavault_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (token && storedUser) {
        // Reject expired tokens
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist a freshly issued token + user
  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(
    async (payload) => {
      try {
        const data = await api.register(payload);
        if (!data.token || !data.user) {
          throw new Error('Invalid response from server: missing token or user data');
        }
        persistSession(data.token, data.user);
        return data;
      } catch (err) {
        console.error('[AuthContext] Register error:', err.message);
        throw err;
      }
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      try {
        const data = await api.login(payload);
        if (!data.token || !data.user) {
          throw new Error('Invalid response from server: missing token or user data');
        }
        persistSession(data.token, data.user);
        return data;
      } catch (err) {
        console.error('[AuthContext] Login error:', err.message);
        throw err;
      }
    },
    [persistSession]
  );

  const googleLogin = useCallback(
    async (payload) => {
      try {
        const data = await api.googleLogin(payload);
        if (!data.token || !data.user) {
          throw new Error('Invalid response from server: missing token or user data');
        }
        persistSession(data.token, data.user);
        return data;
      } catch (err) {
        console.error('[AuthContext] Google login error:', err.message);
        throw err;
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Keep the cached user in sync after a profile edit
  const refreshUser = useCallback((updated) => {
    setUser((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
