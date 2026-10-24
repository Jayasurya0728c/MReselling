import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import storeConfig from '../config/storeConfig';

export default function AdminLogin() {
  const { user, login, resetPassword, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        const url = import.meta.env.VITE_SUPABASE_URL || 'configured URL';
        setError(`Cannot reach Supabase at ${url}. Please verify your internet connection or check if your Supabase project is active (not paused) in your Supabase dashboard.`);
      } else {
        setError(err.message || 'Failed to login. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your administrator email first');
      return;
    }
    setError('');
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-warm-100/50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-warm-200 shadow-card p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-800 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
            NP
          </div>
          <h1 className="font-display font-extrabold text-2xl text-neutral-900">
            Admin Portal
          </h1>
          <p className="text-xs text-neutral-500">
            Secure management for {storeConfig.storeName}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            Password reset link has been sent to your email.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nammudepicks.in"
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 pl-10 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] text-brand-800 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 pl-10 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-800 font-medium">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
