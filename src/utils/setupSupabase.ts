import { supabase } from './supabase';

/**
 * Sets up the necessary Supabase database structure for the application
 * This should be called when the app initializes
 */
export const setupSupabase = async (): Promise<boolean> => {
  try {
    console.log('Setting up Supabase database structure...');
    
    // Check if avatar_url column exists in profiles table
    const { data: columns, error: columnsError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .limit(1);
    
    // If there's an error with the column query, it might mean the table doesn't exist
    // or the column doesn't exist
    if (columnsError) {
      console.log('Adding avatar_url column to profiles table...');
      
      // Use a stored procedure to add the column safely
      const { error: alterError } = await supabase.rpc('add_avatar_url_column');
      
      if (alterError) {
        // If the RPC doesn't exist, create it first
        if (alterError.message.includes('function "add_avatar_url_column" does not exist')) {
          // Create the function
          const { error: createFunctionError } = await supabase
            .from('_exec_sql')
            .insert({
              query: `
                CREATE OR REPLACE FUNCTION add_avatar_url_column()
                RETURNS void AS $$
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
                  
                  -- Check if the address column exists
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
                END;
                $$ LANGUAGE plpgsql;
              `
            });
          
          if (createFunctionError) {
            console.error('Error creating function:', createFunctionError);
            return false;
          }
          
          // Try calling the function again
          const { error: retryError } = await supabase.rpc('add_avatar_url_column');
          if (retryError) {
            console.error('Error adding columns after creating function:', retryError);
            return false;
          }
        } else {
          console.error('Error adding avatar_url column:', alterError);
          return false;
        }
      }
    }
    
    console.log('Supabase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};
