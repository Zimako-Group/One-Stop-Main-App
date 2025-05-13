import { supabase } from './supabase';

/**
 * Sets up the necessary Supabase database structure for the application
 * This should be called when the app initializes
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    console.log('Setting up Supabase database structure...');
    
    // Check if profiles table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') { // 42P01 is the error code for 'relation does not exist'
      console.log('Creating profiles table...');
      
      // Create the profiles table if it doesn't exist
      const { error: createTableError } = await supabase.rpc(
        'execute_sql',
        { sql: 'CREATE TABLE IF NOT EXISTS public.profiles (id UUID PRIMARY KEY, updated_at TIMESTAMP WITH TIME ZONE, user_id UUID UNIQUE REFERENCES auth.users(id))' }
      );
      
      if (createTableError) {
        console.error('Error creating profiles table:', createTableError);
        return false;
      }
    }
    
    // Add avatar_url column directly with SQL
    console.log('Checking and adding avatar_url column if needed...');
    
    // Use the PostgreSQL REST API to execute SQL directly
    const { error: avatarColumnError } = await supabase.rpc(
      'execute_sql',
      { sql: `
        DO $$
        BEGIN
          -- Check if the column exists
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name = 'profiles'
            AND column_name = 'avatar_url'
          ) THEN
            -- Add the column if it doesn't exist
            ALTER TABLE IF EXISTS public.profiles 
            ADD COLUMN avatar_url TEXT;
          END IF;
        END
        $$;
      `}
    );
    
    if (avatarColumnError) {
      // If the execute_sql function doesn't exist, we need to handle this differently
      if (avatarColumnError.message.includes('function "execute_sql" does not exist')) {
        console.log('Using alternative method to check columns...');
        
        // Try to select from the profiles table to see if it exists
        const { error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (profilesError) {
          console.error('Error accessing profiles table:', profilesError);
          return false;
        }
        
        // Since we can't execute SQL directly, we'll use the REST API to check if columns exist
        // and then use the REST API to add them if needed
        try {
          // First, try to select the avatar_url column to see if it exists
          await supabase.from('profiles').select('avatar_url').limit(1);
        } catch (columnError) {
          // If we get an error, the column might not exist, so try to add it
          console.log('Adding avatar_url column using REST API...');
          // We can't directly add columns through the REST API, so we'll need to use the Supabase dashboard
          console.error('Please add the avatar_url column to the profiles table using the Supabase dashboard');
          // Return true to prevent blocking the app, but log a warning
          console.warn('App will continue, but profile avatars may not work correctly');
        }
      } else {
        console.error('Error adding avatar_url column:', avatarColumnError);
        return false;
      }
    }
    
    // Add address column with the same approach
    console.log('Checking and adding address column if needed...');
    
    const { error: addressColumnError } = await supabase.rpc(
      'execute_sql',
      { sql: `
        DO $$
        BEGIN
          -- Check if the column exists
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public'
            AND table_name = 'profiles'
            AND column_name = 'address'
          ) THEN
            -- Add the column if it doesn't exist
            ALTER TABLE IF EXISTS public.profiles 
            ADD COLUMN address TEXT;
          END IF;
        END
        $$;
      `}
    );
    
    if (addressColumnError && !addressColumnError.message.includes('function "execute_sql" does not exist')) {
      console.error('Error adding address column:', addressColumnError);
      return false;
    }
    
    console.log('Supabase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};
