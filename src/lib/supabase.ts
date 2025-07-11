import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
