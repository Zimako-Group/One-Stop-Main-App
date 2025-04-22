import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Login() {
  const { login, resetPassword, loading: authLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const validateForm = () => {
    setError(null);
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    
    // Phone number validation - must be at least 8 digits
    if (phoneNumber.replace(/[^0-9]/g, '').length < 8) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    
    return true;
  };

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Normalize the phone number by removing all non-numeric characters
      const normalizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      
      // Handle different phone number formats (with or without country code)
      let phoneForLogin = normalizedPhoneNumber;
      
      // Generate email from phone number for Supabase auth
      const email = `${phoneForLogin}@onestop.com`;
      
      console.log('Attempting login with:', { phoneNumber: phoneForLogin, email });
      
      const success = await login(email, password);
      
      if (success) {
        router.push('/(tabs)');
      } else {
        // If login fails, try alternative phone number format
        // For example, if user entered with country code but registered without it (or vice versa)
        let alternativeEmail;
        
        // If number starts with country code (e.g., 27 for South Africa), try without it
        if (normalizedPhoneNumber.length > 9 && 
            (normalizedPhoneNumber.startsWith('27') || normalizedPhoneNumber.startsWith('268'))) {
          // Remove country code (27 for South Africa, 268 for Eswatini)
          const withoutCountryCode = normalizedPhoneNumber.startsWith('27') ? 
            normalizedPhoneNumber.substring(2) : 
            normalizedPhoneNumber.startsWith('268') ? normalizedPhoneNumber.substring(3) : normalizedPhoneNumber;
          
          alternativeEmail = `${withoutCountryCode}@onestop.com`;
          console.log('Trying alternative login format:', { alternativeEmail });
          
          const alternativeSuccess = await login(alternativeEmail, password);
          
          if (alternativeSuccess) {
            router.push('/(tabs)');
            return;
          }
        } 
        // If number doesn't have country code, try with common country codes
        else if (normalizedPhoneNumber.length <= 9) {
          // Try with South Africa country code
          alternativeEmail = `27${normalizedPhoneNumber}@onestop.com`;
          console.log('Trying with South Africa country code:', { alternativeEmail });
          
          let alternativeSuccess = await login(alternativeEmail, password);
          
          if (alternativeSuccess) {
            router.push('/(tabs)');
            return;
          }
          
          // Try with Eswatini country code
          alternativeEmail = `268${normalizedPhoneNumber}@onestop.com`;
          console.log('Trying with Eswatini country code:', { alternativeEmail });
          
          alternativeSuccess = await login(alternativeEmail, password);
          
          if (alternativeSuccess) {
            router.push('/(tabs)');
            return;
          }
        }
        
        setError('Invalid phone number or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, password, login]);
  
  const handleResetPassword = useCallback(async () => {
    try {
      setResetLoading(true);
      setResetError(null);
      setResetSuccess(false);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!resetEmail || !emailRegex.test(resetEmail)) {
        setResetError('Please enter a valid email address');
        return;
      }
      
      const { success, error } = await resetPassword(resetEmail);
      
      if (success) {
        setResetSuccess(true);
        // Clear the email field after successful reset
        setResetEmail('');
      } else {
        setResetError(error || 'Failed to send reset instructions');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setResetError('An unexpected error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail, resetPassword]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(26, 35, 126, 0.9)', 'rgba(13, 71, 161, 0.9)', 'rgba(1, 87, 155, 0.9)']}
        style={StyleSheet.absoluteFill}
      />
      
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop' }}
        style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
        blurRadius={2}
      />

      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="planet" size={40} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in with your phone number</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.delay(400).duration(1000)}
        style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#fff" 
            />
          </Pressable>
        </View>

        <Pressable 
          style={styles.forgotPassword}
          onPress={() => setShowForgotPasswordModal(true)}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable 
          style={[styles.button, (loading || authLoading) && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading || authLoading}
        >
          {(loading || authLoading) ? (
            <ActivityIndicator color="#1a237e" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="#fff" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(600).duration(1000)}
        style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </Link>
      </Animated.View>
      
      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#1a237e', '#0d47a1', '#01579b']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {resetSuccess ? 'Reset Instructions Sent' : 'Forgot Password'}
                </Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => {
                    setShowForgotPasswordModal(false);
                    setResetSuccess(false);
                    setResetError(null);
                  }}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>
              
              {resetSuccess ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.successIcon} />
                  <Text style={styles.successText}>
                    Password reset instructions have been sent to your email. Please check your inbox.
                  </Text>
                  <Pressable 
                    style={styles.modalButton}
                    onPress={() => {
                      setShowForgotPasswordModal(false);
                      setResetSuccess(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <Text style={styles.modalSubtitle}>
                    Enter your email address and we'll send you instructions to reset your password.
                  </Text>
                  
                  <View style={styles.modalInputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#fff" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Email Address"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      style={styles.modalInput}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={resetEmail}
                      onChangeText={setResetEmail}
                    />
                  </View>
                  
                  {resetError && (
                    <Text style={styles.modalErrorText}>{resetError}</Text>
                  )}
                  
                  <Pressable 
                    style={[styles.modalButton, resetLoading && styles.disabledButton]}
                    onPress={handleResetPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color="#1a237e" size="small" />
                    ) : (
                      <Text style={styles.modalButtonText}>Send Reset Instructions</Text>
                    )}
                  </Pressable>
                </>
              )}
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    marginTop: '15%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    color: '#fff',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  button: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  orText: {
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 12,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  modalInput: {
    flex: 1,
    height: 52,
    color: '#fff',
    fontSize: 16,
  },
  modalErrorText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successIcon: {
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});