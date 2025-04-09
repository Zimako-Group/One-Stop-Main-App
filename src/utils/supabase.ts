import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = 'https://nwjeutoxpzvqwmzisgtg.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53amV1dG94cHp2cXdtemlzZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDcxNTEsImV4cCI6MjA1ODcyMzE1MX0.7DkE4_fK7azQK7ftcUNXHs1bIC-x6pW_VViMbr6OOUg';

if (!supabaseAnonKey) {
  console.error('Missing Supabase anon key');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
