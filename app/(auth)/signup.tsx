import { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    setError(null);
    
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    
    // Phone number validation - must be at least 8 digits
    if (phoneNumber.replace(/[^0-9]/g, '').length < 8) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    // Email is optional, but if provided, validate it
    if (email.trim() && !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  // Animation values for the loading animation
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Animated styles
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value
    };
  });
  
  // Start animations when loading modal is shown
  useEffect(() => {
    if (showLoadingModal) {
      // Rotation animation
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }), 
        -1 // Infinite repeat
      );
      
      // Pulse animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.in(Easing.ease) })
        ),
        -1 // Infinite repeat
      );
      
      // Opacity animation
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 700 }),
          withTiming(1, { duration: 700 })
        ),
        -1 // Infinite repeat
      );
    }
  }, [showLoadingModal]);

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      setShowLoadingModal(true);
      setError(null);
      
      // Use the email if provided, otherwise it will be generated from the phone number
      const emailToUse = email.trim() ? email : undefined;
      
      // Simulate a slight delay to show the loading animation (can be removed in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = await signup(fullName, phoneNumber, emailToUse, password);
      
      if (success) {
        setShowLoadingModal(false);
        setShowSuccessModal(true);
        
        // Automatically redirect to login page after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.replace('/(auth)');
        }, 3000);
      } else {
        setShowLoadingModal(false);
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setShowLoadingModal(false);
      setError('An error occurred during signup. Please try again.');
    }
  }, [fullName, phoneNumber, email, password, confirmPassword, signup]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={StyleSheet.absoluteFill}
      />
      
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60' }}
        style={StyleSheet.absoluteFill}
        blurRadius={60}
      />
      
      {/* Loading Modal */}
      <Modal
        visible={showLoadingModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          <LinearGradient
            colors={['rgba(26, 35, 126, 0.9)', 'rgba(13, 71, 161, 0.9)']}
            style={styles.loadingModalContent}
          >
            <Animated.View style={[styles.loadingIconContainer, animatedIconStyle]}>
              <Ionicons name="person-add-outline" size={40} color="#fff" />
            </Animated.View>
            <Text style={styles.loadingText}>Signing Up...</Text>
            <Text style={styles.loadingSubText}>Creating your account</Text>
          </LinearGradient>
        </View>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          <LinearGradient
            colors={['rgba(46, 125, 50, 0.9)', 'rgba(56, 142, 60, 0.9)']}
            style={styles.successModalContent}
          >
            <Animated.View 
              entering={FadeIn.delay(300).duration(500)}
              style={styles.successIconContainer}
            >
              <Ionicons name="checkmark-circle" size={60} color="#fff" />
            </Animated.View>
            <Animated.Text 
              entering={FadeInDown.delay(500).duration(500)}
              style={styles.successText}
            >
              Success!
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(700).duration(500)}
              style={styles.successSubText}
            >
              Your account has been created successfully
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(900).duration(500)}
              style={styles.redirectText}
            >
              Redirecting to login...
            </Animated.Text>
          </LinearGradient>
        </View>
      </Modal>

      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="planet" size={40} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>Join Us</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.delay(400).duration(1000)}
        style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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
          <Ionicons name="mail-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Email (Optional)"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Pressable 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1a237e" size="small" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
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
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)" asChild>
          <Pressable>
            <Text style={styles.footerLink}>Login</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}

// Need to import BlurView for the modals
const BlurView = require('expo-blur').BlurView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    marginTop: '10%',
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
  button: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingModalContent: {
    width: 250,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  successModalContent: {
    width: 300,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  successSubText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
});