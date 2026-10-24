import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client — uses environment variables set in Vercel dashboard
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are server-only (not VITE_ prefixed)
let supabase = null;

export function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  if (!supabase) {
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return supabase;
}
