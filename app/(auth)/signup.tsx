import { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();

  // Animation for the loading icon
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (showLoadingModal) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000 }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [showLoadingModal]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    // Basic phone number validation for Eswatini numbers
    // Should be 7-8 digits for local numbers
    const phoneRegex = /^[0-9]{7,8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid Eswatini phone number');
      return false;
    }

    if (email.trim()) {
      // Only validate email if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
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

    setError(null);
    return true;
  };

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setShowLoadingModal(true);
      
      // Add the Eswatini country code to the phone number
      const formattedPhoneNumber = `+268${phoneNumber.replace(/[^0-9]/g, '')}`;

      const result = await signup(fullName, formattedPhoneNumber, email || undefined, password);

      if (result.success) {
        setShowLoadingModal(false);
        setShowSuccessModal(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/(auth)');
        }, 3000);
      } else {
        setShowLoadingModal(false);
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setShowLoadingModal(false);
      setError('An error occurred during signup. Please try again.');
    }
  }, [fullName, phoneNumber, email, password, confirmPassword, signup]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
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
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Animated.View entering={FadeIn.delay(200).duration(1000)} style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="planet" size={40} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>Join Us</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(1000)} style={styles.form}>
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
            <View style={styles.phoneInputContainer}>
              <Text style={styles.prefixText}>+268</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.phoneInput}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
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
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#fff" />
            </Pressable>
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

        <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Login</Text>
            </Pressable>
          </Link>
        </Animated.View>
      </ScrollView>

      {/* Loading Modal */}
      <Modal visible={showLoadingModal} transparent={true} animationType="fade">
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
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          <LinearGradient
            colors={['rgba(46, 125, 50, 0.9)', 'rgba(56, 142, 60, 0.9)']}
            style={styles.successModalContent}
          >
            <Animated.View entering={FadeIn.duration(500)} style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle-outline" size={80} color="#4CAF50" />
            </Animated.View>
            <Animated.Text entering={FadeInDown.delay(500).duration(500)} style={styles.successText}>
              Success!
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(500).duration(500)} style={styles.successText}>
              Your account has been created successfully
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(900).duration(500)} style={styles.redirectText}>
              Redirecting to login...
            </Animated.Text>
          </LinearGradient>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1,
    height: 50,
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