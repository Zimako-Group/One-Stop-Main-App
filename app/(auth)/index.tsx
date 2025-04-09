import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
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
  const { login, loading: authLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      // Generate email from phone number for Supabase auth
      const email = `${phoneNumber.replace(/[^0-9]/g, '')}@onestop.com`;
      
      const success = await login(email, password);
      
      if (success) {
        router.push('/(tabs)');
      } else {
        setError('Invalid phone number or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, password, login]);

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
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.forgotPassword}>
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
});