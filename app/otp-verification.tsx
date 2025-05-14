import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';
import { AuthStatus } from '../src/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpVerification() {
  const { verifyOtp, resendOtp, authStatus, loading } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown for resend
  const [resendLoading, setResendLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
  // Create refs for the OTP input fields
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  
  // Get phone number from AsyncStorage
  useEffect(() => {
    const getPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('otpPhoneNumber');
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        }
      } catch (error) {
        console.error('Error getting phone number from AsyncStorage:', error);
      }
    };
    
    getPhoneNumber();
  }, []);
  
  // Redirect if user is already verified
  useEffect(() => {
    if (authStatus === AuthStatus.VERIFIED) {
      router.replace('/(tabs)');
    } else if (authStatus === AuthStatus.LOGGED_OUT) {
      router.replace('/');
    }
  }, [authStatus]);
  
  // Start countdown for resend button
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Reset countdown when resend is clicked
  const resetCountdown = () => {
    setCountdown(60);
  };
  
  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    // Update the digit at the current index
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = text;
    setOtpDigits(newOtpDigits);
    
    // Combine all digits to form the complete OTP
    setOtp(newOtpDigits.join(''));
    
    // Auto-focus to next input if a digit is entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle backspace key press
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // Focus on previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      setError(null);
      
      if (otp.length !== 6) {
        setError('Please enter all 6 digits of the OTP');
        return;
      }
      
      const result = await verifyOtp(otp);
      
      if (result.success) {
        // OTP verified successfully, will be redirected by the authStatus effect
      } else {
        setError(result.error || 'Failed to verify OTP');
        // Clear OTP fields on error
        setOtpDigits(['', '', '', '', '', '']);
        setOtp('');
        // Focus on first input
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setResendLoading(true);
      setError(null);
      
      const result = await resendOtp();
      
      if (result.success) {
        Alert.alert('OTP Sent', 'A new verification code has been sent to your phone.');
        resetCountdown();
        // Clear OTP fields
        setOtpDigits(['', '', '', '', '', '']);
        setOtp('');
        // Focus on first input
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a237e', '#3949ab', '#3f51b5']}
        style={styles.background}
      />
      
      <Animated.View
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        
        <Text style={styles.title}>Verify Your Phone</Text>
      </Animated.View>
      
      <Animated.View
        entering={FadeInDown.delay(400).duration(1000)}
        style={styles.content}
      >
        <Text style={styles.subtitle}>
          We've sent a verification code to {phoneNumber || 'your phone'}
        </Text>
        
        <View style={styles.otpContainer}>
          {otpDigits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Pressable
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color="#1a237e" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </Pressable>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <Pressable
            onPress={handleResendOtp}
            disabled={countdown > 0 || resendLoading}
          >
            <Text
              style={[
                styles.resendButton,
                (countdown > 0 || resendLoading) && styles.resendDisabled
              ]}
            >
              {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  resendButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
});
