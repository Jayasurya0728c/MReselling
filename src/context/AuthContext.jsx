import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);
const LOCAL_ADMIN_KEY = 'nammude_picks_admin_auth_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check active session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // 2. Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Local fallback mode when Supabase credentials are not yet set
      try {
        const localAuth = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (localAuth) {
          const parsed = JSON.parse(localAuth);
          setUser(parsed);
          setSession({ user: parsed });
        }
      } catch (e) {
        console.error('Error loading local auth state:', e);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } else {
      // Local development fallback
      if (email === 'admin@nammudepicks.in' && password === 'admin123') {
        const mockUser = {
          id: 'admin-local-01',
          email: 'admin@nammudepicks.in',
          role: 'authenticated',
          user_metadata: { name: 'Store Owner' }
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
        return { user: mockUser, session: { user: mockUser } };
      } else {
        throw new Error('Invalid demo credentials. Use admin@nammudepicks.in / admin123, or connect Supabase in .env.');
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });
      if (error) throw error;
      return true;
    } else {
      throw new Error('Password reset requires Supabase Auth setup. Please configure your .env file.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: Boolean(user),
        isSupabaseConfigured,
        login,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
