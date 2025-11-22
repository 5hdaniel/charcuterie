import { createClient } from '@supabase/supabase-js';

// These will be populated by Vercel Environment Variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. App will not function correctly in production.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');