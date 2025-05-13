-- Migration: Add avatar_url and address columns to profiles table
-- This migration creates a function that can be called via RPC to add columns to the profiles table

-- First, create the function that will add the columns
CREATE OR REPLACE FUNCTION public.add_avatar_url_column()
RETURNS void AS $$
BEGIN
  -- Check if the avatar_url column exists
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

-- Grant execute permission to authenticated and anon roles
GRANT EXECUTE ON FUNCTION public.add_avatar_url_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_avatar_url_column() TO anon;

-- Also create a generic execute_sql function that can be used for other SQL operations
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon roles
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO anon;
