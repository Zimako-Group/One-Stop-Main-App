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

  const signup = async (fullName: string, phoneNumber: string, email: string | undefined, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // If email is not provided, generate one using the phone number
      const userEmail = email || `${phoneNumber.replace(/[^0-9]/g, '')}@onestop.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              phone_number: phoneNumber,
              email: userEmail,
              account_number: `ACC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError.message);
          return false;
        }

        // Set the user in state
        setUser({
          id: data.user.id,
          email: userEmail,
          fullName,
          phoneNumber,
          accountNumber: `ACC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
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

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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