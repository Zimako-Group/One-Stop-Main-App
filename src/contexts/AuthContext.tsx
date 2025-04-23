import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { id, email } = data.session.user;
        
        // Get user profile from Supabase
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        setUser({
          id,
          email: email || '',
          fullName: profileData?.full_name || '',
          phoneNumber: profileData?.phone_number || '',
          accountNumber: profileData?.account_number || ''
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // First try to sign in with the email (which is derived from phone number)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        // Get user profile by user ID
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            fullName: profileData.full_name || '',
            phoneNumber: profileData.phone_number || '',
            accountNumber: profileData.account_number || ''
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName: string, phoneNumber: string, email: string | undefined, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      setLoading(true);
      
      // Keep the phone number as provided (with the +268 prefix)
      const formattedPhoneNumber = phoneNumber;
      
      // Extract just the digits for authentication
      const phoneDigits = phoneNumber.replace(/[^0-9]/g, '');
      
      // If email is not provided, generate one using the phone digits
      const userEmail = email || `${phoneDigits}@onestop.com`;
      
      console.log('Attempting signup with:', { 
        fullName, 
        phoneNumber: formattedPhoneNumber,
        email: userEmail 
      });
      
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: formattedPhoneNumber
          }
        }
      });

      if (error) {
        console.error('Supabase auth signup error:', error.message);
        return { success: false, error: `Authentication error: ${error.message}` };
      }
      
      console.log('Signup response:', data);

      if (!data.user) {
        console.error('No user data returned from signup');
        return { success: false, error: 'No user data returned from signup' };
      }
      
      // Generate a unique account number
      const accountNumber = `ACC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      console.log('Creating profile for user:', data.user.id);
      
      // First check if a profile with this phone number already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (existingProfile) {
        console.error('Phone number already in use:', phoneNumber);
        // Clean up the auth user since we won't be using it
        await supabase.auth.signOut();
        return { success: false, error: 'This phone number is already registered. Please use a different phone number or try logging in.' };
      }
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for 'no rows returned'
        console.error('Error checking existing profile:', checkError.message);
      }
      
      // Create a profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
            email: userEmail,
            account_number: accountNumber
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
        
        // Handle duplicate phone number error specifically
        if (profileError.message.includes('duplicate key value') && 
            profileError.message.includes('profiles_phone_number_idx')) {
          // Clean up the auth user since we won't be using it
          await supabase.auth.signOut();
          return { success: false, error: 'This phone number is already registered. Please use a different phone number or try logging in.' };
        }
        
        return { success: false, error: `Profile creation error: ${profileError.message}` };
      }

      console.log('Profile created successfully');
      
      // Set the user in state
      setUser({
        id: data.user.id,
        email: userEmail,
        fullName,
        phoneNumber,
        accountNumber
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      console.error('Signup error:', errorMessage, error);
      return { success: false, error: `Exception: ${errorMessage}` };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{success: boolean, error?: string}> => {
    try {
      setLoading(true);
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // We'll directly attempt to send the reset email
      // Supabase will handle the case where the email doesn't exist
      
      // Send password reset email directly to the provided email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'onestopapp://reset-password',
      });
      
      if (error) {
        console.error('Password reset error:', error.message);
        return { success: false, error: `Failed to send reset instructions: ${error.message}` };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: `An unexpected error occurred: ${error?.message || 'Unknown error'}` };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};