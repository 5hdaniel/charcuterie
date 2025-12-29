import { createClient } from '@supabase/supabase-js';

// Helper to get environment variables safely across different build tools (Vite vs CRA/Node)
const getEnv = (key: string, viteKey: string) => {
  // Check for Vite (import.meta.env)
  // @ts-ignore - import.meta might not be defined in all environments
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  // Check for standard process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[viteKey] || process.env[`REACT_APP_${key}`];
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey &&
    supabaseUrl !== 'your-project-url.supabase.co' &&
    !supabaseUrl.includes('placeholder'));
};

if (!isSupabaseConfigured()) {
  console.error("⚠️ Supabase credentials not configured!");
  console.error("Please set the following environment variables in Vercel:");
  console.error("  - VITE_SUPABASE_URL");
  console.error("  - VITE_SUPABASE_ANON_KEY");
  console.error("See VERCEL_DEPLOYMENT.md for setup instructions.");
}

// Only create client if properly configured, otherwise use dummy values
// This prevents network errors when credentials are missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key'
);