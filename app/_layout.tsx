import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WalletProvider } from '../src/contexts/WalletContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { setupSupabase } from '../src/utils/setupSupabase';
import { initializeStorage } from '../src/utils/profileImageService';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        // Setup Supabase database schema
        await setupSupabase();
        
        // Initialize storage buckets
        await initializeStorage();
        
        // Framework ready signal
        window.frameworkReady?.();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <WalletProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="top-up" />
          </Stack>
          <StatusBar style="light" />
        </WalletProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}