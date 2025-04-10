import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the Supabase URL and anon key from environment variables or use hardcoded values as fallback
const supabaseUrl = 'https://nwjeutoxpzvqwmzisgtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53amV1dG94cHp2cXdtemlzZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDcxNTEsImV4cCI6MjA1ODcyMzE1MX0.7DkE4_fK7azQK7ftcUNXHs1bIC-x6pW_VViMbr6OOUg';

// Log configuration for debugging
console.log('Initializing Supabase with:');
console.log('URL:', supabaseUrl);
console.log('Key available:', !!supabaseAnonKey);

// Create a single supabase client for interacting with your database
// Use AsyncStorage for persistence in React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Verify the client was created successfully
console.log('Supabase client initialized:', !!supabase);

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event);
});

// Export a function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};
