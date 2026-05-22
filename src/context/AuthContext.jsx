'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signOut as betterAuthSignOut, updateProfile } from '@/lib/auth-client';
import { api, set401Handler } from '@/lib/api';

const AuthContext = createContext(null);

const USER_KEY = 'ideavault_user';

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const handlerSetRef = useRef(false);

  // Set up the 401 error handler once
  useEffect(() => {
    if (!handlerSetRef.current) {
      set401Handler(() => {
        // Clear user data when 401 occurs
        localStorage.removeItem(USER_KEY);
        setUser(null);
        // Redirect to login
        router.push('/login?error=session_expired');
      });
      handlerSetRef.current = true;
    }
  }, [router]);

  // Initialize session from Better Auth on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Try to get session from Better Auth with retries for OAuth scenarios
        let result = null;
        for (let i = 0; i < 2; i++) {
          result = await getSession();
          if (result?.user) {
            break;
          }
          if (i === 0) {
            // Small delay before retry
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        if (result?.user) {
          setUser(result.user);
          localStorage.setItem(USER_KEY, JSON.stringify(result.user));
          console.log('[AuthContext] User loaded from session:', result.user.name);
        } else {
          // Try to restore from localStorage as fallback
          const storedUser = localStorage.getItem(USER_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log('[AuthContext] User restored from localStorage');
          } else {
            console.log('[AuthContext] No user session found');
          }
        }
      } catch (error) {
        console.error('[AuthContext] Failed to initialize session:', error);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Update local user state and persist to localStorage
  const setUserData = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const register = useCallback(
    async (payload) => {
      try {
        const data = await api.register(payload);
        // With cookie-based auth, token is in HTTP-Only cookie, not response body
        if (!data.user) {
          throw new Error('Invalid response from server: missing user data');
        }
        setUserData(data.user);
        return data;
      } catch (err) {
        console.error('[AuthContext] Register error:', err.message);
        throw err;
      }
    },
    [setUserData]
  );

  const login = useCallback(
    async (payload) => {
      try {
        const data = await api.login(payload);
        // With cookie-based auth, token is in HTTP-Only cookie, not response body
        if (!data.user) {
          throw new Error('Invalid response from server: missing user data');
        }
        setUserData(data.user);
        return data;
      } catch (err) {
        console.error('[AuthContext] Login error:', err.message);
        throw err;
      }
    },
    [setUserData]
  );

  const logout = useCallback(async () => {
    try {
      // Call the logout endpoint to invalidate the session on the backend
      await api.logout();
    } catch (err) {
      // Even if the API call fails, we should still clear local state and redirect
      console.error('[AuthContext] Logout API error:', err.message);
    } finally {
      // Clear local user state
      localStorage.removeItem(USER_KEY);
      setUser(null);

      // Sign out from Better Auth
      try {
        await betterAuthSignOut();
      } catch (err) {
        console.error('[AuthContext] Better Auth sign out error:', err.message);
      }
    }
  }, []);

  // Keep the cached user in sync after a profile edit
  const refreshUser = useCallback((updated) => {
    setUser((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  // Update profile
  const updateUserProfile = useCallback(
    async (updates) => {
      try {
        const result = await updateProfile(updates);
        if (result.success) {
          setUserData(result.user);
          return result;
        }
        throw new Error(result.error || 'Update failed');
      } catch (err) {
        console.error('[AuthContext] Update profile error:', err.message);
        throw err;
      }
    },
    [setUserData]
  );

  // Refresh session from Better Auth (useful after OAuth redirect)
  const refreshSession = useCallback(async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await getSession();
        if (result?.user) {
          setUserData(result.user);
          return result.user;
        }
        // Wait before retrying
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`[AuthContext] Refresh session attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // Final fallback: check localStorage
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      return JSON.parse(storedUser);
    }

    return null;
  }, [setUserData]);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    refreshUser,
    setUserData,
    updateUserProfile,
    refreshSession,
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
