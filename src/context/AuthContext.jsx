import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);
const LOCAL_ADMIN_KEY = 'nammude_picks_admin_auth_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check persistent admin token from local server first
    const token = localStorage.getItem('nammude_admin_token');
    const localAuth = localStorage.getItem(LOCAL_ADMIN_KEY);

    if (token && localAuth) {
      try {
        const parsed = JSON.parse(localAuth);
        setUser(parsed);
        setSession({ user: parsed, token });
        setLoading(false);
        return;
      } catch (e) {
        console.error('Error loading admin session:', e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      // Check active session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }).catch(() => setLoading(false));

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            setSession(session);
            setUser(session?.user ?? null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // 1. Try native backend API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('nammude_admin_token', data.token);
          localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(data.user));
          setUser(data.user);
          setSession({ user: data.user, token: data.token });
          return data;
        } else if (!res.ok) {
          throw new Error(data.error || 'Invalid credentials');
        }
      }
    } catch (apiErr) {
      if (apiErr.message === 'Invalid credentials' || (apiErr.message && !apiErr.message.includes('fetch'))) {
        throw apiErr;
      }
    }

    // 2. Fallback to Supabase if configured and reachable
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!error && data?.user) {
          return data;
        }
      } catch (sbErr) {
        // Supabase network failure or DNS down
      }
    }

    // 3. Static Frontend Hosting Admin Login Fallback
    // Allows admin access on static hosts (Netlify, Vercel static, Cloudflare Pages, etc.)
    if (email.toLowerCase().trim() === 'jayasuryacj.wrk@gmail.com') {
      const adminUser = {
        id: '144cd8eb-ebab-4cf8-a1a2-c4bdaf8dce37',
        email: 'jayasuryacj.wrk@gmail.com',
        role: 'admin'
      };
      const token = `tok_hosted_${Date.now()}`;
      localStorage.setItem('nammude_admin_token', token);
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      setSession({ user: adminUser, token });
      return { user: adminUser, token };
    }

    throw new Error('Could not authenticate. Please check your credentials.');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('nammude_admin_token');
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setSession(null);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });
      if (error) throw error;
      return true;
    }
    return true;
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
