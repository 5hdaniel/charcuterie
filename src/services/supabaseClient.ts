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

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Please check your .env file or Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');