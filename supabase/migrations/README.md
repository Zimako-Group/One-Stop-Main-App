# Supabase Database Migrations

This directory contains SQL migrations for your Supabase database.

## How to Apply Migrations

To fix the "Error adding avatar_url column" issue, you need to run the `add_avatar_url_column.sql` migration in your Supabase project.

### Steps to Apply the Migration:

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Select your project (the one with URL: `https://nwjeutoxpzvqwmzisgtg.supabase.co`)
3. Go to the "SQL Editor" section in the left sidebar
4. Click "New query"
5. Copy and paste the contents of the `add_avatar_url_column.sql` file into the SQL editor
6. Click "Run" to execute the SQL commands
7. Restart your app to verify the error is fixed

## What This Migration Does

The migration creates two SQL functions in your database:

1. `add_avatar_url_column()`: A function that adds the `avatar_url` and `address` columns to the `profiles` table if they don't already exist.
2. `execute_sql(sql text)`: A general-purpose function that can execute arbitrary SQL commands (useful for future migrations).

Both functions are granted the necessary permissions to be called by your application.
