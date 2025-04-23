import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useWallet } from '../src/contexts/WalletContext';
import { purchaseMtnAirtime } from '../src/utils/mtnAirtimeService';

// Types for our service options
type Network = 'MTN' | 'ESM' | null;
type ServiceType = 'airtime' | 'data' | null;

// Package types
interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  validity: string;
}

// Predefined packages
const MTN_DATA_PACKAGES: Package[] = [
  { id: 'mtn-d1', name: '100MB', price: 10, description: 'Daily Data', validity: '24 hours' },
  { id: 'mtn-d2', name: '500MB', price: 25, description: 'Weekly Data', validity: '7 days' },
  { id: 'mtn-d3', name: '1GB', price: 50, description: 'Monthly Data', validity: '30 days' },
  { id: 'mtn-d4', name: '5GB', price: 150, description: 'Monthly Data', validity: '30 days' },
  { id: 'mtn-d5', name: '10GB', price: 250, description: 'Monthly Data', validity: '30 days' },
];

const ESM_DATA_PACKAGES: Package[] = [
  // Daily Bundles
  { id: 'esm-daily-1', name: '50MB', price: 2, description: 'Daily Data', validity: '24 hours' },
  { id: 'esm-daily-2', name: '100MB', price: 5, description: 'Daily Data', validity: '24 hours' },
  { id: 'esm-daily-3', name: '250MB', price: 10, description: 'Daily Data', validity: '24 hours' },
  
  // Weekly Bundles
  { id: 'esm-weekly-1', name: '250MB', price: 17, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-weekly-2', name: '500MB', price: 20, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-weekly-3', name: '1GB', price: 45, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-weekly-4', name: '2GB', price: 65, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-weekly-5', name: '5GB', price: 160, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-weekly-6', name: '48GB', price: 500, description: 'Weekly Data', validity: '7 days' },
  
  // YouTube Daily Bundles
  { id: 'esm-yt-1', name: '1GB', price: 10, description: 'YouTube Daily', validity: '24 hours' },
  { id: 'esm-yt-2', name: '2.5GB', price: 20, description: 'YouTube Daily', validity: '24 hours' },
  { id: 'esm-yt-3', name: '5GB', price: 35, description: 'YouTube Daily', validity: '24 hours' },
  
  // Short Term Bundles
  { id: 'esm-st-1', name: '1GB Daily', price: 25, description: 'Short Term', validity: '24 hours' },
  { id: 'esm-st-2', name: 'Unlimited', price: 50, description: 'Short Term', validity: '24 hours' },
];

// No Frills Bundles for Eswatini Mobile
const ESM_NO_FRILLS_BUNDLES = {
  basic: {
    id: 'esm-nf1', 
    name: 'No Frills Bundle', 
    price: 25, 
    description: 'All-in-one bundle', 
    validity: '30 days',
    benefits: [
      '1GB',
      '500 MB Anytime Data',
      '500 MB Nightime Data',
      '100 on-net minutes',
      '10 off-net minutes',
      '20 SMS',
    ],
  },
  premium: {
    id: 'esm-nf2', 
    name: 'No Frills Bundle Plus', 
    price: 50, 
    description: 'Premium all-in-one bundle', 
    validity: '30 days',
    benefits: [
      '2.5 GB',
      '1.25 GB Anytime Data',
      '1.25 GB Nightime Data',
      '250 on-net minutes',
      '30 off-net minutes',
      '60 SMS',
      'Unlimited On-Net (weekends)',
    ],
  },
  ultra: {
    id: 'esm-nf3', 
    name: 'No Frills Bundle Ultra', 
    price: 100, 
    description: 'Ultra all-in-one bundle', 
    validity: '30 days',
    benefits: [
      '7GB',
      '3.5 GB Anytime Data',
      '3.5 GB Night Data',
      '300 On-net Minutes',
      '60 off-net minutes',
      '90 SMS',
      'Unlimited On-net (weekends)',
    ],
  },
  max: {
    id: 'esm-nf4', 
    name: 'No Frills Bundle Max', 
    price: 195, 
    description: 'Maximum all-in-one bundle', 
    validity: '30 days',
    benefits: [
      '15GB',
      '7.5 GB Anytime Data',
      '7.5 GB Night Data',
      '600 On-net Minutes',
      '90 off-net minutes',
      '120 SMS',
      'Unlimited On-net (weekends)',
    ],
  },
  ultimate: {
    id: 'esm-nf5', 
    name: 'No Frills Bundle Ultimate', 
    price: 295, 
    description: 'Ultimate all-in-one bundle', 
    validity: '30 days',
    benefits: [
      '20GB',
      '10 GB Anytime Data',
      '10 GB Night Data',
      'Unlimited On-net Minutes',
      '100 off-net minutes',
      '180 SMS',
    ],
  },
  infinite: {
    id: 'esm-nf6', 
    name: 'No Frills Bundle Infinite', 
    price: 495, 
    description: 'Infinite all-in-one bundle', 
    validity: '30 days',
    benefits: [
      '48 GB Anytime Data',
      'Unlimited On-net Minutes',
      '200 off-net minutes',
      '200 SMS',
    ],
  },
};

const MTN_AIRTIME_PACKAGES: Package[] = [
  { id: 'mtn-a1', name: 'E10', price: 10, description: 'Airtime', validity: 'No expiry' },
  { id: 'mtn-a2', name: 'E20', price: 20, description: 'Airtime', validity: 'No expiry' },
  { id: 'mtn-a3', name: 'E50', price: 50, description: 'Airtime', validity: 'No expiry' },
  { id: 'mtn-a4', name: 'E100', price: 100, description: 'Airtime', validity: 'No expiry' },
];

const ESM_AIRTIME_PACKAGES: Package[] = [
  { id: 'esm-a1', name: 'E10', price: 10, description: 'Airtime', validity: 'No expiry' },
  { id: 'esm-a2', name: 'E20', price: 20, description: 'Airtime', validity: 'No expiry' },
  { id: 'esm-a3', name: 'E50', price: 50, description: 'Airtime', validity: 'No expiry' },
  { id: 'esm-a4', name: 'E100', price: 100, description: 'Airtime', validity: 'No expiry' },
];

// Custom AnimatedPressable component
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BuyServices() {
  const { balance, deductFromWallet } = useWallet();
  const { service } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  
  // State for service selection
  const [network, setNetwork] = useState<Network>(null);
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // State for MoMo payment
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [momoNumber, setMomoNumber] = useState('');
  const [momoError, setMomoError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  
  // Card details state
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cvv, setCvv] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(150.00); // Dummy wallet balance
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  
  // MoMo state

  // e-Mali state
  const [showEMaliModal, setShowEMaliModal] = useState(false);
  const [eMaliNumber, setEMaliNumber] = useState('');
  const [eMaliError, setEMaliError] = useState<string | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const spin = useSharedValue(0);

  // Animated styles for the network cards
  const networkCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Animated styles for the processing icon
  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${spin.value * 360}deg`,
        },
      ],
    };
  });

  // Create the spinning animation
  const startSpinAnimation = () => {
    spin.value = 0;
    spin.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite repetitions
      false // Don't reverse
    );
  };

  // Get relevant packages based on network and service type
  const getPackages = () => {
    if (!network || !serviceType) return [];
    if (network === 'MTN') {
      return serviceType === 'data' ? MTN_DATA_PACKAGES : MTN_AIRTIME_PACKAGES;
    }
    // For Eswatini Mobile data, filter out special bundles (they'll be shown separately)
    if (network === 'ESM' && serviceType === 'data') {
      return ESM_DATA_PACKAGES.filter(pkg => 
        !pkg.description.includes('Short Term') && 
        !pkg.description.includes('YouTube Daily')
      );
    }
    return ESM_AIRTIME_PACKAGES;
  };

  // Get Short Term Bundles for Eswatini Mobile
  const getShortTermBundles = () => {
    if (network === 'ESM' && serviceType === 'data') {
      return ESM_DATA_PACKAGES.filter(pkg => pkg.description.includes('Short Term'));
    }
    return [];
  };

  // Get YouTube Daily Bundles for Eswatini Mobile
  const getYouTubeBundles = () => {
    if (network === 'ESM' && serviceType === 'data') {
      return ESM_DATA_PACKAGES.filter(pkg => pkg.description.includes('YouTube Daily'));
    }
    return [];
  };

  // Get No Frills Bundle for Eswatini Mobile
  const getNoFrillsBundle = () => {
    if (network === 'ESM' && serviceType === 'data') {
      return ESM_NO_FRILLS_BUNDLES;
    }
    return null;
  };

  // Handle network selection
  const handleNetworkSelect = (selected: Network) => {
    setNetwork(selected);
    setSelectedPackage(null);
    cardScale.value = withSpring(1.05, {}, () => {
      cardScale.value = withSpring(1);
    });
  };

  // Handle service type selection
  const handleServiceSelect = (selected: ServiceType) => {
    setServiceType(selected);
    setSelectedPackage(null);
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };

  // Validate phone number
  const validatePhoneNumber = (number: string) => {
    // Updated regex to support both MTN and Eswatini Mobile numbers
    // MTN: Starts with 76 or 78, followed by 6 more digits
    // Eswatini Mobile: Starts with 77 or 79, followed by 6 more digits
    const regex = /^7[6-9]\d{6}$/;
    return regex.test(number);
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!network || !serviceType) {
      setError('Please select a network and service type');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Eswatini phone number');
      return;
    }

    if (!selectedPackage && !customAmount) {
      setError('Please select a package or enter a custom amount');
      return;
    }

    if (customAmount && (parseFloat(customAmount) < 1 || parseFloat(customAmount) > 1000)) {
      setError('Custom amount must be between E1 and E1000');
      return;
    }

    setError(null);
    
    // If MTN airtime is selected, use the MTN API directly
    if (network === 'MTN' && serviceType === 'airtime') {
      // For MTN airtime, we'll use the MTN MoMo API
      setShowMomoModal(true);
    } else {
      // For other services, show the confirmation modal
      setShowConfirmModal(true);
    }
  };
  
  // Process MTN airtime purchase using the MTN API
  const processMtnAirtime = async () => {
    try {
      setLoading(true);
      
      // Get the amount to purchase
      const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
      
      // Call the MTN API to purchase airtime
      const result = await purchaseMtnAirtime({
        phoneNumber: phoneNumber,
        amount: amount,
        payerPhoneNumber: momoNumber || phoneNumber // Use MoMo number if provided, otherwise use recipient number
      });
      
      if (result.success) {
        // Set the transaction ID and show success modal
        setTransactionId(result.transactionId || '');
        setShowMomoModal(false);
        setShowSuccessModal(true);
        
        // Log the successful transaction
        console.log('MTN airtime purchase successful:', result);
      } else {
        Alert.alert('Purchase Failed', result.message);
      }
    } catch (error) {
      console.error('MTN airtime purchase error:', error);
      Alert.alert('Purchase Failed', 'An error occurred while processing your airtime purchase.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle MoMo payment submission
  const handleMomoPayment = async () => {
    if (!momoNumber || momoNumber.length < 8) {
      setMomoError('Please enter a valid phone number');
      return;
    }
    
    setMomoError(null);
    
    // For MTN airtime, use the MTN API
    if (network === 'MTN' && serviceType === 'airtime') {
      processMtnAirtime();
    } else {
      // For other services, use the existing payment flow
      setShowMomoModal(false);
      setShowConfirmModal(true);
    }
  };

// Process MTN airtime purchase using the MTN API
const processMtnAirtimePurchase = async () => {
  try {
    setLoading(true);
    
    // Get the amount to purchase
    const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
    
    // Get the MoMo phone number from the input or use the recipient number
    const payerPhoneNumber = momoNumber || phoneNumber;
    
    // Call the MTN API to purchase airtime
    const result = await purchaseMtnAirtime({
      phoneNumber: phoneNumber,
      amount: amount,
      payerPhoneNumber: payerPhoneNumber
    });
    
    if (result.success) {
      // Set the transaction ID and show success modal
      setTransactionId(result.transactionId || '');
      setShowMomoModal(false);
      setShowSuccessModal(true);
    } else {
      Alert.alert('Purchase Failed', result.message);
    }
  } catch (error) {
    console.error('MTN airtime purchase error:', error);
    Alert.alert('Purchase Failed', 'An error occurred while processing your airtime purchase.');
  } finally {
    setLoading(false);
  }
};



  // Format card number with spaces after every 4 digits
  const formatCardNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    
    return formatted;
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: 'Wallet' | 'MoMo' | 'e-Mali' | 'Bank Card') => {
    // Close the payment method modal
    setShowPaymentMethodModal(false);
    
    // Handle different payment methods
    if (method === 'Wallet') {
      // Process wallet payment directly
      handleConfirmPurchase();
    } else if (method === 'MoMo') {
      // Show MoMo payment modal
      setShowMomoModal(true);
    } else if (method === 'e-Mali') {
      // Show eMali payment modal (not implemented yet)
      Alert.alert('Coming Soon', 'e-Mali payment integration is coming soon.');
    } else if (method === 'Bank Card') {
      // Show card details modal
      setShowCardDetailsModal(true);
    }
  };
  
  // Process payment after successful payment processing
  const processPayment = () => {
    try {
      // Get the amount to purchase
      const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
      
      // Get the description based on the selected package or custom amount
      const description = selectedPackage 
        ? `${network} ${serviceType}: ${selectedPackage.name}` 
        : `${network} ${serviceType}: E${amount}`;
      
      // Set payment method for the receipt
      setPaymentMethod('MoMo');
      
      // Generate a transaction ID
      const txId = Math.random().toString(36).substring(2, 15);
      setTransactionId(txId);
      
      // Show the success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error finalizing payment:', error);
      Alert.alert('Error', 'An error occurred while finalizing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle wallet payment submission
  const handleWalletPayment = async () => {
    try {
      // Set loading state
      setLoading(true);
      
      // Get the amount to purchase
      const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
      
      // Check if there's enough balance
      if (balance < amount) {
        setInsufficientFunds(true);
        setLoading(false);
        return;
      }
      
      // Get the description based on the selected package or custom amount
      const description = selectedPackage 
        ? `${network} ${serviceType}: ${selectedPackage.name}` 
        : `${network} ${serviceType}: E${amount}`;
      
      // Deduct from wallet
      const success = await deductFromWallet(amount, description, 'purchase');
      
      if (success) {
        // Close the wallet modal
        setShowWalletModal(false);
        
        // Set payment method for the receipt
        setPaymentMethod('Wallet');
        
        // Generate a transaction ID
        const txId = Math.random().toString(36).substring(2, 15);
        setTransactionId(txId);
        
        // Show the success modal
        setShowSuccessModal(true);
      } else {
        // Show insufficient balance error
        setInsufficientFunds(true);
      }
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      Alert.alert('Error', 'An error occurred while processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle card payment submission
  const handleCardPayment = async () => {
    try {
      // Validate card details
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setCardError('Please enter a valid card number');
        return;
      }
      
      if (!cardholderName) {
        setCardError('Please enter the cardholder name');
        return;
      }
      
      if (!expiryDate || expiryDate.length < 5) {
        setCardError('Please enter a valid expiry date');
        return;
      }
      
      if (!cvv || cvv.length < 3) {
        setCardError('Please enter a valid CVV');
        return;
      }
      
      // Clear any previous errors
      setCardError(null);
      
      // Set loading state
      setLoading(true);
      
      // Get the amount to purchase
      const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
      
      // In a real app, you would process the payment with a payment gateway here
      // For this demo, we'll simulate a successful payment after a short delay
      setTimeout(() => {
        // Close the card details modal
        setShowCardDetailsModal(false);
        
        // Set payment method for the receipt
        setPaymentMethod('Bank Card');
        
        // Generate a transaction ID
        const txId = Math.random().toString(36).substring(2, 15);
        setTransactionId(txId);
        
        // Show the success modal
        setShowSuccessModal(true);
        
        // Reset loading state
        setLoading(false);
        
        // If user chose to save the card, you would store it securely here
        if (saveCard) {
          // In a real app, you would securely store the card details
          console.log('Card saved for future use');
        }
      }, 2000); // Simulate a 2-second processing time
    } catch (error) {
      console.error('Error processing card payment:', error);
      setCardError('An error occurred while processing your payment');
      setLoading(false);
    }
  };
  
  // Handle confirmation of purchase from the modal
  const handleConfirmPurchase = async () => {
    try {
      setLoading(true);
      
      // Get the amount to purchase
      const amount = selectedPackage ? selectedPackage.price : parseFloat(customAmount || '0');
      
      // Get the description based on the selected package or custom amount
      const description = selectedPackage 
        ? `${network} ${serviceType}: ${selectedPackage.name}` 
        : `${network} ${serviceType}: E${amount}`;
      
      // Deduct from wallet
      const success = await deductFromWallet(amount, description, 'purchase');
      
      if (success) {
        // Generate a transaction ID
        const txId = Math.random().toString(36).substring(2, 15);
        setTransactionId(txId);
        
        // Close the confirmation modal and show the success modal
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        // Show insufficient balance error
        Alert.alert('Insufficient Balance', 'You do not have enough balance to complete this purchase.');
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      Alert.alert('Error', 'An error occurred while processing your purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Close success modal and reset form
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    
    // Reset the form
    setNetwork(null);
    setServiceType(null);
    setPhoneNumber('');
    setCustomAmount('');
    setSelectedPackage(null);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />

      {/* Header */}
      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Buy Services</Text>
      </Animated.View>

      {/* Network Selection */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Select Network</Text>
        <View style={styles.networkContainer}>
          <AnimatedPressable
            style={[
              styles.networkCard,
              network === 'MTN' && styles.selectedNetworkCard,
              networkCardStyle,
            ]}
            onPress={() => handleNetworkSelect('MTN')}>
            <LinearGradient
              colors={['rgba(255, 204, 0, 0.8)', 'rgba(255, 167, 0, 0.9)']}
              style={styles.networkGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.networkLogoContainer}>
                <Image
                  source={require('../assets/images/mtn-logo.jpg')}
                  style={styles.networkLogoEnhanced}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.networkNameEnhanced}>MTN Eswatini</Text>
              <Text style={styles.networkDescription}>Y'ello! The widest network coverage</Text>
              {network === 'MTN' && (
                <View style={styles.networkSelectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                </View>
              )}
            </LinearGradient>
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.networkCard,
              network === 'ESM' && styles.selectedNetworkCard,
              networkCardStyle,
            ]}
            onPress={() => handleNetworkSelect('ESM')}>
            <LinearGradient
              colors={['rgba(220, 53, 69, 0.8)', 'rgba(178, 34, 52, 0.9)']}
              style={styles.networkGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.networkLogoContainer}>
                <Image
                  source={require('../assets/images/eswatini-logo.jpg')}
                  style={styles.networkLogoEnhanced}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.networkNameEnhanced}>Eswatini Mobile</Text>
              <Text style={styles.networkDescription}>Connecting Eswatini</Text>
              {network === 'ESM' && (
                <View style={styles.networkSelectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                </View>
              )}
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* Service Type Selection */}
      <Animated.View 
        entering={FadeInDown.delay(600).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        <View style={styles.serviceContainer}>
          {[
            { 
              type: 'airtime', 
              icon: 'phone-portrait', 
              label: 'Airtime',
              colors: ['rgba(255, 87, 34, 0.7)', 'rgba(244, 67, 54, 0.8)'],
              description: 'Recharge your phone'
            },
            { 
              type: 'data', 
              icon: 'wifi', 
              label: 'Data Bundle',
              colors: ['rgba(33, 150, 243, 0.7)', 'rgba(3, 169, 244, 0.8)'],
              description: 'Stay connected'
            },
          ].map((service) => (
            <Pressable
              key={service.type}
              style={[
                styles.serviceCard,
                serviceType === service.type && styles.selectedService,
              ]}
              onPress={() => handleServiceSelect(service.type as ServiceType)}>
              <LinearGradient
                colors={service.colors}
                style={styles.serviceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.serviceIconContainer}>
                  <Ionicons 
                    name={service.icon as any}
                    size={32}
                    color="#fff"
                  />
                </View>
                <Text style={styles.serviceLabel}>{service.label}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                {serviceType === service.type && (
                  <View style={styles.serviceSelectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  </View>
                )}
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Phone Number Input */}
      <Animated.View 
        entering={FadeInDown.delay(800).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Phone Number</Text>
        <View style={styles.phoneInputWrapper}>
          <LinearGradient
            colors={['rgba(41, 121, 255, 0.4)', 'rgba(29, 91, 212, 0.6)']}
            style={styles.phoneGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            borderRadius={16}
          >
            <View style={styles.phoneInputContainer}>
              <View style={styles.prefixContainer}>
                <Text style={styles.prefixEnhanced}>+268</Text>
              </View>
              <View style={styles.phoneNumberDivider} />
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
                placeholder="7612 3456"
                placeholderTextColor="rgba(255,255,255,0.5)"
                maxLength={8}
              />
              {phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber) && (
                <Pressable 
                  style={styles.clearButton}
                  onPress={() => setPhoneNumber('')}
                >
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
                </Pressable>
              )}
              {validatePhoneNumber(phoneNumber) && (
                <View style={styles.validIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Packages */}
      {network && serviceType && (
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(1000)}
          style={styles.section}>
          {/* No Frills Bundles - Only for Eswatini Mobile Data */}
          {network === 'ESM' && serviceType === 'data' && (
            <>
              <Text style={styles.sectionTitle}>No Frills Bundles</Text>
              <View style={styles.noFrillsWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.noFrillsBundlesContainer}>
                  {/* Convert object to array for easier mapping */}
                  {Object.values(ESM_NO_FRILLS_BUNDLES).map((bundle) => (
                    <Pressable
                      key={bundle.id}
                      style={[
                        styles.noFrillsCard,
                        selectedPackage?.id === bundle.id && styles.selectedPackage,
                      ]}
                      onPress={() => {
                        setSelectedPackage(bundle);
                        setCustomAmount('');
                      }}>
                      <LinearGradient
                        colors={['rgba(33, 150, 243, 0.8)', 'rgba(30, 136, 229, 0.9)']}
                        style={styles.noFrillsGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.noFrillsBadge}>
                          <Text style={styles.noFrillsBadgeText}>
                            {bundle.id === 'esm-nf1' ? 'Basic' : 
                             bundle.id === 'esm-nf2' ? 'Plus' : 
                             bundle.id === 'esm-nf3' ? 'Ultra' : 
                             bundle.id === 'esm-nf4' ? 'Max' : 
                             bundle.id === 'esm-nf5' ? 'Ultimate' : 'Infinite'}
                          </Text>
                        </View>
                        <Text style={styles.noFrillsTitle}>{bundle.name}</Text>
                        <Text style={styles.noFrillsPrice}>E{bundle.price}</Text>
                        <View style={styles.noFrillsDivider} />
                        <View style={styles.noFrillsContent}>
                          {/* Display different content based on bundle type */}
                          {bundle.id === 'esm-nf1' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 1GB</Text>
                              <Text style={styles.noFrillsItem}>• 500 MB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• 500 MB Nightime Data</Text>
                              <Text style={styles.noFrillsItem}>• 100 on-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 10 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 20 SMS'</Text>
                            </>
                          )}
                          {bundle.id === 'esm-nf2' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 2.5 GB</Text>
                              <Text style={styles.noFrillsItem}>• 1.25 GB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• 1.25 GB Nightime Data</Text>
                              <Text style={styles.noFrillsItem}>• 250 on-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 30 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 60 SMS</Text>
                              <Text style={styles.noFrillsItem}>• Unlimited On-Net (weekends)</Text>
                            </>
                          )}
                          {bundle.id === 'esm-nf3' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 7GB</Text>
                              <Text style={styles.noFrillsItem}>• 3.5 GB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• 3.5 GB Night Data</Text>
                              <Text style={styles.noFrillsItem}>• 300 On-net Minutes</Text>
                              <Text style={styles.noFrillsItem}>• 60 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 90 SMS'</Text>
                              <Text style={styles.noFrillsItem}>• Unlimited On-net (weekends)</Text>
                            </>
                          )}
                          {bundle.id === 'esm-nf4' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 15GB</Text>
                              <Text style={styles.noFrillsItem}>• 7.5 GB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• 7.5 GB Night Data</Text>
                              <Text style={styles.noFrillsItem}>• 600 On-net Minutes</Text>
                              <Text style={styles.noFrillsItem}>• 90 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 120 SMS'</Text>
                              <Text style={styles.noFrillsItem}>• Unlimited On-net (weekends)</Text>
                            </>
                          )}
                          {bundle.id === 'esm-nf5' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 20GB</Text>
                              <Text style={styles.noFrillsItem}>• 10 GB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• 10 GB Night Data</Text>
                              <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes</Text>
                              <Text style={styles.noFrillsItem}>• 100 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 180 SMS'</Text>
                            </>
                          )}
                          {bundle.id === 'esm-nf6' && (
                            <>
                              <Text style={styles.noFrillsItem}>• 48 GB Anytime Data</Text>
                              <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes</Text>
                              <Text style={styles.noFrillsItem}>• 200 off-net minutes</Text>
                              <Text style={styles.noFrillsItem}>• 200 SMS'</Text>
                            </>
                          )}
                        </View>
                        <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                      </LinearGradient>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Select Bundle</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.packagesContainer, { minHeight: 200 }]}>
            {getPackages().map((pkg) => (
              <Pressable
                key={pkg.id}
                style={[
                  styles.packageCard,
                  { height: 180 },
                  selectedPackage?.id === pkg.id && styles.selectedPackage,
                ]}
                onPress={() => {
                  setSelectedPackage(pkg);
                  setCustomAmount('');
                }}>
                <LinearGradient
                  colors={pkg.id.startsWith('mtn') 
                    ? ['rgba(255, 204, 0, 0.8)', 'rgba(255, 167, 0, 0.9)'] 
                    : ['rgba(220, 53, 69, 0.8)', 'rgba(178, 34, 52, 0.9)']}
                  style={styles.packageGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.packageBadge}>
                    <Text style={styles.packageBadgeText}>{pkg.description}</Text>
                  </View>
                  <Text style={styles.packageNameEnhanced}>{pkg.name}</Text>
                  <Text style={styles.packagePriceEnhanced}>E{pkg.price}</Text>
                  <View style={styles.packageDivider} />
                  <Text style={styles.packageValidityEnhanced}>{pkg.validity}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>

          {/* Short Term Bundles - Only for Eswatini Mobile Data */}
          {network === 'ESM' && serviceType === 'data' && getShortTermBundles().length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Short Term Bundles</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.packagesContainer}>
                {getShortTermBundles().map((pkg) => (
                  <Pressable
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      { height: 180 },
                      selectedPackage?.id === pkg.id && styles.selectedPackage,
                    ]}
                    onPress={() => {
                      setSelectedPackage(pkg);
                      setCustomAmount('');
                    }}>
                    <LinearGradient
                      colors={['rgba(220, 53, 69, 0.8)', 'rgba(178, 34, 52, 0.9)']}
                      style={styles.packageGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.packageBadge}>
                        <Text style={styles.packageBadgeText}>Short Term</Text>
                      </View>
                      <Text style={styles.packageNameEnhanced}>{pkg.name}</Text>
                      <Text style={styles.packagePriceEnhanced}>E{pkg.price}</Text>
                      <View style={styles.packageDivider} />
                      <Text style={styles.packageValidityEnhanced}>{pkg.validity}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}

          {/* YouTube Daily Bundles - Only for Eswatini Mobile Data */}
          {network === 'ESM' && serviceType === 'data' && getYouTubeBundles().length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>YouTube Bundles</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.packagesContainer, { minHeight: 200 }]}>
                {getYouTubeBundles().map((pkg) => (
                  <Pressable
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      { height: 180 },
                      selectedPackage?.id === pkg.id && styles.selectedPackage,
                    ]}
                    onPress={() => {
                      setSelectedPackage(pkg);
                      setCustomAmount('');
                    }}>
                    <LinearGradient
                      colors={['rgba(220, 53, 69, 0.8)', 'rgba(178, 34, 52, 0.9)']}
                      style={styles.packageGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.packageBadge}>
                        <Text style={styles.packageBadgeText}>YouTube</Text>
                      </View>
                      <Text style={styles.packageNameEnhanced}>{pkg.name}</Text>
                      <Text style={styles.packagePriceEnhanced}>E{pkg.price}</Text>
                      <View style={styles.packageDivider} />
                      <Text style={styles.packageValidityEnhanced}>{pkg.validity}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
          {/* Custom Amount - Only show for Airtime */}
          {serviceType === 'airtime' && (
            <View style={styles.customAmountContainer}>
              <Text style={styles.customAmountLabel}>Or Enter Custom Amount</Text>
              <View style={styles.customAmountInput}>
                <Text style={styles.currency}>E</Text>
                <TextInput
                  style={styles.amountInput}
                  value={customAmount}
                  onChangeText={(text) => {
                    setCustomAmount(text);
                    setSelectedPackage(null);
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>
            </View>
          )}
        </Animated.View>
      )}

      {/* Error Message */}
      {error && (
        <Animated.Text 
          entering={FadeIn}
          style={styles.errorText}>
          {error}
        </Animated.Text>
      )}

      {/* Purchase Button */}
      <Animated.View 
        entering={FadeInDown.delay(1200).duration(1000)}
        style={styles.buttonContainer}>
        <Pressable
          style={[styles.purchaseButton, loading && styles.loadingButton]}
          onPress={handlePurchase}
          disabled={loading || isProcessingPayment}>
          {loading || isProcessingPayment ? (
            <ActivityIndicator color="#1a237e" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Purchase
            </Text>
          )}
        </Pressable>
      </Animated.View>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#2c3e50', '#1a237e']}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Purchase</Text>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Network:</Text>
                  <Text style={styles.summaryValue}>{network}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Service:</Text>
                  <Text style={styles.summaryValue}>{serviceType === 'data' ? 'Data Bundle' : 'Airtime'}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Phone Number:</Text>
                  <Text style={styles.summaryValue}>+268 {phoneNumber}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Package:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedPackage 
                      ? selectedPackage.name 
                      : customAmount 
                        ? `Custom Amount (E${customAmount})` 
                        : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>
                    E{selectedPackage ? selectedPackage.price : customAmount}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Validity:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedPackage 
                      ? selectedPackage.validity 
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowConfirmModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmPurchase}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#2c3e50', '#1a237e']}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>
              </View>
              
              <View style={styles.paymentMethodsContainer}>
                {/* Wallet */}
                <Pressable 
                  style={styles.paymentMethodCard}
                  onPress={() => handlePaymentMethodSelect('Wallet')}>
                  <LinearGradient
                    colors={['rgba(33, 150, 243, 0.8)', 'rgba(30, 136, 229, 0.9)']}
                    style={styles.paymentMethodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="wallet" size={24} color="#fff" />
                    </View>
                    <Text style={styles.paymentMethodName}>Wallet</Text>
                    <Text style={styles.paymentMethodDesc}>Pay using your One-Stop wallet balance</Text>
                  </LinearGradient>
                </Pressable>
                
                {/* MTN MoMo */}
                <Pressable 
                  style={styles.paymentMethodCard}
                  onPress={() => handlePaymentMethodSelect('MoMo')}>
                  <LinearGradient
                    colors={['rgba(255, 204, 0, 0.8)', 'rgba(255, 167, 0, 0.9)']}
                    style={styles.paymentMethodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="phone-portrait" size={24} color="#fff" />
                    </View>
                    <Text style={styles.paymentMethodName}>MTN MoMo</Text>
                    <Text style={styles.paymentMethodDesc}>Pay using MTN Mobile Money</Text>
                  </LinearGradient>
                </Pressable>
                
                {/* e-Mali */}
                <Pressable 
                  style={styles.paymentMethodCard}
                  onPress={() => handlePaymentMethodSelect('e-Mali')}>
                  <LinearGradient
                    colors={['#e53935', '#d32f2f', '#c62828']} // e-Mali Red colors
                    style={styles.paymentMethodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="cash" size={24} color="#fff" />
                    </View>
                    <Text style={styles.paymentMethodName}>e-Mali</Text>
                    <Text style={styles.paymentMethodDesc}>Pay using Eswatini Mobile e-Mali</Text>
                  </LinearGradient>
                </Pressable>
                
                {/* Bank Card */}
                <Pressable 
                  style={styles.paymentMethodCard}
                  onPress={() => handlePaymentMethodSelect('Bank Card')}>
                  <LinearGradient
                    colors={['rgba(76, 175, 80, 0.8)', 'rgba(56, 142, 60, 0.9)']}
                    style={styles.paymentMethodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="card" size={24} color="#fff" />
                    </View>
                    <Text style={styles.paymentMethodName}>Bank Card</Text>
                    <Text style={styles.paymentMethodDesc}>Pay using debit or credit card</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              
              <Pressable 
                style={styles.cancelPaymentButton}
                onPress={() => setShowPaymentMethodModal(false)}>
                <Text style={styles.cancelPaymentText}>Cancel</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Card Details Modal */}
      {showCardDetailsModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#1a237e', '#0d47a1', '#01579b']}
              style={styles.cardModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardModalHeader}>
                <Text style={styles.cardModalTitle}>Payment Details</Text>
                <View style={styles.cardTypeContainer}>
                  <View style={styles.cardTypeIcon}>
                    <Ionicons name="card" size={20} color="#fff" />
                  </View>
                  <View style={styles.cardTypeIcon}>
                    <Ionicons name="logo-paypal" size={20} color="#fff" />
                  </View>
                  <View style={styles.cardTypeIcon}>
                    <Ionicons name="card-outline" size={20} color="#fff" />
                  </View>
                </View>
              </View>
              
              <View style={styles.cardDetailsContainer}>
                <View style={styles.cardInputGroup}>
                  <Text style={styles.cardInputLabel}>Card Number</Text>
                  <View style={styles.cardInputContainer}>
                    <TextInput
                      style={styles.cardInput}
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      keyboardType="numeric"
                      maxLength={19} // 16 digits + 3 spaces
                    />
                    <View style={styles.cardBrandIcon}>
                      <Ionicons 
                        name={cardNumber.startsWith('4') ? 'card' : cardNumber.startsWith('5') ? 'card-outline' : 'card'} 
                        size={24} 
                        color="#fff" 
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardInputGroup}>
                  <Text style={styles.cardInputLabel}>Cardholder Name</Text>
                  <View style={styles.cardInputContainer}>
                    <TextInput
                      style={styles.cardInput}
                      value={cardholderName}
                      onChangeText={setCardholderName}
                      placeholder="John Doe"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      autoCapitalize="words"
                    />
                  </View>
                </View>
                
                <View style={styles.cardDetailsRow}>
                  <View style={[styles.cardInputGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.cardInputLabel}>Expiry Date</Text>
                    <View style={styles.cardInputContainer}>
                      <TextInput
                        style={styles.cardInput}
                        value={expiryDate}
                        onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                        placeholder="MM/YY"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                  </View>
                  
                  <View style={[styles.cardInputGroup, { flex: 1 }]}>
                    <Text style={styles.cardInputLabel}>CVV</Text>
                    <View style={styles.cvvInputContainer}>
                      <TextInput
                        style={styles.cardInput}
                        value={cvv}
                        onChangeText={setCvv}
                        placeholder="123"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry={true}
                      />
                      <Pressable 
                        style={styles.cvvInfoIcon}
                        onPress={() => Alert.alert(
                          "CVV Code",
                          "The CVV is a 3-digit security code found on the back of your card."
                        )}
                      >
                        <Ionicons name="information-circle-outline" size={24} color="#fff" />
                      </Pressable>
                    </View>
                  </View>
                </View>
                
                {cardError && (
                  <View style={styles.cardErrorContainer}>
                    <Ionicons name="alert-circle" size={18} color="#ff4444" />
                    <Text style={styles.cardErrorText}>{cardError}</Text>
                  </View>
                )}
                
                <View style={styles.saveCardContainer}>
                  <Pressable 
                    style={styles.saveCardCheckbox}
                    onPress={() => setSaveCard(!saveCard)}
                  >
                    <Ionicons name={saveCard ? "checkmark" : "close-outline"} size={18} color="#fff" />
                  </Pressable>
                  <Text style={styles.saveCardText}>Save card for future payments</Text>
                </View>
              </View>
              
              <View style={styles.cardAmountContainer}>
                <Text style={styles.cardAmountLabel}>Total Amount:</Text>
                <Text style={styles.cardAmountValue}>
                  E{selectedPackage ? selectedPackage.price : customAmount}
                </Text>
              </View>
              
              <Pressable 
                style={styles.cardPayButton}
                onPress={handleCardPayment}>
                <LinearGradient
                  colors={['#43a047', '#2e7d32']}
                  style={styles.cardPayButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.cardPayButtonText}>Pay Now</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>
              
              <Pressable 
                style={styles.cardCancelButton}
                onPress={() => {
                  setShowCardDetailsModal(false);
                  setShowPaymentMethodModal(true);
                }}>
                <Text style={styles.cardCancelButtonText}>Back to Payment Methods</Text>
              </Pressable>
              
              <View style={styles.securePaymentInfo}>
                <Ionicons name="lock-closed" size={16} color="#fff" />
                <Text style={styles.securePaymentText}>Secure Payment</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#43a047', '#2e7d32']}
              style={styles.walletModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.walletModalHeader}>
                <Text style={styles.walletModalTitle}>One Stop Wallet</Text>
                <Ionicons name="wallet-outline" size={30} color="#fff" />
              </View>
              
              <View style={styles.walletBalanceContainer}>
                <Text style={styles.walletBalanceLabel}>Available Balance</Text>
                <Text style={styles.walletBalanceAmount}>E{walletBalance.toFixed(2)}</Text>
              </View>
              
              <View style={styles.walletDivider} />
              
              <View style={styles.walletTransactionDetails}>
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionLabel}>Transaction Amount:</Text>
                  <Text style={styles.transactionValue}>
                    E{selectedPackage ? selectedPackage.price : customAmount}
                  </Text>
                </View>
                
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionLabel}>Service:</Text>
                  <Text style={styles.transactionValue}>
                    {serviceType} {network && `(${network})`}
                  </Text>
                </View>
                
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionLabel}>Recipient:</Text>
                  <Text style={styles.transactionValue}>{phoneNumber}</Text>
                </View>
                
                {insufficientFunds && (
                  <View style={styles.insufficientFundsContainer}>
                    <Ionicons name="alert-circle" size={24} color="#ff4444" />
                    <Text style={styles.insufficientFundsText}>
                      Insufficient funds. Please top up your wallet.
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.walletButtonsContainer}>
                {insufficientFunds ? (
                  <Pressable 
                    style={styles.walletTopUpButton}
                    onPress={handleWalletPayment}>
                    <LinearGradient
                      colors={['#1a237e', '#0d47a1']}
                      style={styles.walletButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.walletButtonText}>Top Up Wallet</Text>
                      <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    </LinearGradient>
                  </Pressable>
                ) : (
                  <View style={styles.walletActionButtons}>
                    <Pressable 
                      style={styles.walletPayButton}
                      onPress={handleWalletPayment}>
                      <LinearGradient
                        colors={['#1a237e', '#0d47a1']}
                        style={styles.walletButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.walletButtonText}>Pay Now</Text>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      </LinearGradient>
                    </Pressable>
                    
                    <Pressable 
                      style={styles.walletTopUpButton}
                      onPress={() => {
                        setShowWalletModal(false);
                        Alert.alert('Top Up', 'Navigating to wallet top-up screen...');
                      }}>
                      <View style={styles.walletSecondaryButton}>
                        <Text style={styles.walletSecondaryButtonText}>Top Up</Text>
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                      </View>
                    </Pressable>
                  </View>
                )}
                
                <Pressable 
                  style={styles.walletCancelButton}
                  onPress={() => {
                    setShowWalletModal(false);
                    setShowPaymentMethodModal(true);
                  }}>
                  <Text style={styles.walletCancelButtonText}>Back to Payment Methods</Text>
                </Pressable>
              </View>
              
              <View style={styles.securePaymentInfo}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
                <Text style={styles.securePaymentText}>Secure Wallet Transaction</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* MTN MoMo Modal */}
      {showMomoModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#ffcc00', '#ffb700', '#ffa500']} // MTN Yellow colors
              style={styles.momoModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.momoModalHeader}>
                <Text style={[styles.momoModalTitle, { color: '#000' }]}>MTN MoMo Payment</Text>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/1200px-New-mtn-logo.svg.png' }}
                  style={styles.momoLogo}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Amount:</Text>
                  <Text style={styles.momoTransactionValue}>
                    E{selectedPackage ? selectedPackage.price : customAmount}
                  </Text>
                </View>
                
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Service:</Text>
                  <Text style={styles.momoTransactionValue}>
                    {serviceType} {network && `(${network})`}
                  </Text>
                </View>
                
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Recipient:</Text>
                  <Text style={styles.momoTransactionValue}>{phoneNumber}</Text>
                </View>
              </View>
              
              <View style={styles.walletDivider} />
              
              <View style={styles.momoNumberContainer}>
                <Text style={[styles.momoNumberLabel, { color: '#000' }]}>Enter MoMo Number</Text>
                <View style={styles.momoInputWrapper}>
                  <Text style={styles.momoCountryCode}>+268</Text>
                  <TextInput
                    style={styles.momoNumberInput}
                    value={momoNumber}
                    onChangeText={(text) => {
                      // Only allow digits
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setMomoNumber(cleaned);
                      // Clear error when user types
                      if (momoError) setMomoError(null);
                    }}
                    keyboardType="numeric"
                    placeholder="7812 3456"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    maxLength={10}
                  />
                </View>
                <Text style={styles.momoInputHint}>Enter the phone number registered with MTN MoMo</Text>
              </View>
              
              {momoError && (
                <View style={styles.momoErrorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff0000" />
                  <Text style={[styles.momoErrorText, { color: '#ff0000' }]}>{momoError}</Text>
                </View>
              )}
              
              <Pressable 
                style={styles.momoPayButton}
                onPress={() => {
                  // Validate MoMo number
                  if (momoNumber.length < 8) {
                    setMomoError('Please enter a valid MTN MoMo number');
                    return;
                  }
                  // Simulate payment processing
                  setIsProcessingPayment(true);
                  setShowMomoModal(false);
                  setShowProcessingModal(true);
                  startSpinAnimation();
                  setTimeout(() => {
                    setShowProcessingModal(false);
                    setIsProcessingPayment(false);
                    processPayment();
                  }, 3000);
                }}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']} // Blue for contrast with yellow
                  style={styles.momoPayButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.momoPayButtonText}>Authorize Payment</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>
              
              <Pressable 
                style={styles.momoCancelButton}
                onPress={() => {
                  setShowMomoModal(false);
                  setShowPaymentMethodModal(true);
                }}>
                <Text style={styles.momoCancelButtonText}>Back to Payment Methods</Text>
              </Pressable>
              
              <View style={styles.momoSecurityInfo}>
                <Ionicons name="shield-checkmark" size={16} color="#000" />
                <Text style={styles.momoSecurityText}>Secure MTN MoMo Transaction</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* e-Mali Modal */}
      {showEMaliModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#e53935', '#d32f2f', '#c62828']} // e-Mali Red colors
              style={styles.momoModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.momoModalHeader}>
                <Text style={[styles.momoModalTitle, { color: '#fff' }]}>e-Mali Payment</Text>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/1200px-New-mtn-logo.svg.png' }}
                  style={styles.momoLogo}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Amount:</Text>
                  <Text style={styles.momoTransactionValue}>
                    E{selectedPackage ? selectedPackage.price : customAmount}
                  </Text>
                </View>
                
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Service:</Text>
                  <Text style={styles.momoTransactionValue}>
                    {serviceType} {network && `(${network})`}
                  </Text>
                </View>
                
                <View style={styles.momoTransactionItem}>
                  <Text style={styles.momoTransactionLabel}>Recipient:</Text>
                  <Text style={styles.momoTransactionValue}>{phoneNumber}</Text>
                </View>
              </View>
              
              <View style={styles.walletDivider} />
              
              <View style={styles.momoNumberContainer}>
                <Text style={[styles.momoNumberLabel, { color: '#fff' }]}>Enter e-Mali Number</Text>
                <View style={styles.momoInputWrapper}>
                  <Text style={styles.momoCountryCode}>+268</Text>
                  <TextInput
                    style={styles.momoNumberInput}
                    value={eMaliNumber}
                    onChangeText={(text) => {
                      // Only allow digits
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setEMaliNumber(cleaned);
                      // Clear error when user types
                      if (eMaliError) setEMaliError(null);
                    }}
                    keyboardType="numeric"
                    placeholder="7812 3456"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    maxLength={10}
                  />
                </View>
                <Text style={styles.momoInputHint}>Enter the phone number registered with e-Mali</Text>
              </View>
              
              {eMaliError && (
                <View style={styles.momoErrorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff0000" />
                  <Text style={[styles.momoErrorText, { color: '#ff0000' }]}>{eMaliError}</Text>
                </View>
              )}
              
              <Pressable 
                style={styles.momoPayButton}
                onPress={() => {
                  // Validate e-Mali number
                  if (eMaliNumber.length < 8) {
                    setEMaliError('Please enter a valid e-Mali number');
                    return;
                  }
                  // Simulate payment processing
                  setIsProcessingPayment(true);
                  setShowEMaliModal(false);
                  setShowProcessingModal(true);
                  startSpinAnimation();
                  setTimeout(() => {
                    setShowProcessingModal(false);
                    setIsProcessingPayment(false);
                    processPayment();
                  }, 3000);
                }}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']} // Blue for contrast with yellow
                  style={styles.momoPayButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.momoPayButtonText}>Authorize Payment</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>
              
              <Pressable 
                style={styles.momoCancelButton}
                onPress={() => {
                  setShowEMaliModal(false);
                  setShowPaymentMethodModal(true);
                }}>
                <Text style={styles.momoCancelButtonText}>Back to Payment Methods</Text>
              </Pressable>
              
              <View style={styles.momoSecurityInfo}>
                <Ionicons name="shield-checkmark" size={16} color="#fff" />
                <Text style={styles.momoSecurityText}>Secure e-Mali Transaction</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Processing Modal */}
      {showProcessingModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.processingModalContainer}>
            <LinearGradient
              colors={['#1a237e', '#0d47a1', '#01579b']}
              style={styles.processingModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.processingContent}>
                <View style={styles.processingIconContainer}>
                  <Animated.View style={spinStyle}>
                    <Ionicons name="card-outline" size={40} color="#fff" />
                  </Animated.View>
                  <ActivityIndicator size="large" color="#fff" style={styles.processingSpinner} />
                </View>
                
                <Text style={styles.processingTitle}>Processing Payment</Text>
                <Text style={styles.processingText}>Please wait while we securely process your transaction...</Text>
                
                <View style={styles.processingDetails}>
                  <View style={styles.processingDetailItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.processingDetailText}>Card details verified</Text>
                  </View>
                  <View style={styles.processingDetailItem}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.processingDetailText}>Connecting to payment gateway</Text>
                  </View>
                </View>
                
                <View style={styles.securePaymentInfo}>
                  <Ionicons name="lock-closed" size={16} color="#fff" />
                  <Text style={styles.securePaymentText}>Secure Payment</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.modalContainer}>
            <LinearGradient
              colors={['#43a047', '#2e7d32']}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={80} color="#ffffff" />
              </View>
              
              <Text style={styles.successTitle}>Purchase Successful!</Text>
              
              <View style={styles.successContent}>
                <Text style={styles.successMessage}>
                  Your {serviceType === 'data' ? 'data bundle' : 'airtime'} has been successfully purchased and loaded to +268 {phoneNumber}.
                </Text>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLabel}>Transaction ID:</Text>
                  <Text style={styles.transactionValue}>{transactionId}</Text>
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLabel}>Payment Method:</Text>
                  <Text style={styles.transactionValue}>{paymentMethod || 'Wallet'}</Text>
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLabel}>Date & Time:</Text>
                  <Text style={styles.transactionValue}>
                    {new Date().toLocaleString('en-SZ', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLabel}>Amount:</Text>
                  <Text style={styles.transactionValue}>
                    E{selectedPackage ? selectedPackage.price : customAmount}
                  </Text>
                </View>
              </View>
              
              <Pressable 
                style={styles.doneButton}
                onPress={handleCloseSuccess}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  gradient: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  networkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  networkCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  selectedNetworkCard: {
    transform: [{ scale: 1.03 }],
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
  },
  networkGradient: {
    padding: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  networkLogoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  networkLogoEnhanced: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  networkNameEnhanced: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  networkDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  networkSelectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  selectedService: {
    transform: [{ scale: 1.03 }],
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
  },
  serviceGradient: {
    padding: 20,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  serviceSelectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  phoneInputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  phoneGradient: {
    padding: 3,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    height: 60,
  },
  prefixContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
  },
  prefixEnhanced: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  phoneNumberDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
  },
  clearButton: {
    padding: 6,
  },
  validIndicator: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  packagesContainer: {
    paddingBottom: 16,
    gap: 12,
  },
  packageCard: {
    width: 160,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedPackage: {
    transform: [{ scale: 1.03 }],
    borderWidth: 2,
    borderColor: '#fff',
  },
  packageGradient: {
    padding: 16,
    height: '100%',
    alignItems: 'center',
  },
  packageNameEnhanced: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  packagePriceEnhanced: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  packageDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
    width: '80%',
  },
  packageValidityEnhanced: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  packageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    marginBottom: 8,
  },
  packageBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  noFrillsCard: {
    width: 220,
    height: 320,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  noFrillsGradient: {
    padding: 16,
    height: '100%',
  },
  noFrillsBundlesContainer: {
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
  },
  noFrillsWrapper: {
    height: 350,
    marginBottom: 16,
  },
  noFrillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  noFrillsPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  noFrillsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 12,
    width: '100%',
  },
  noFrillsContent: {
    marginVertical: 8,
    width: '100%',
  },
  noFrillsItem: {
    fontSize: 11,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '500',
  },
  noFrillsValidity: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noFrillsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
  },
  noFrillsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infiniteBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  customAmountContainer: {
    marginTop: 24,
  },
  customAmountLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 52,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 16,
  },
  purchaseButton: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButton: {
    opacity: 0.8,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  successContent: {
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  transactionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  transactionValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  paymentMethodCard: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 16,
  },
  paymentMethodGradient: {
    padding: 16,
    height: '100%',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  paymentMethodDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
  cancelPaymentButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cancelPaymentText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  cardDetailsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  cvvInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  expiryDateContainer: {
    flexDirection: 'row',
  },
  expiryDateInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  cardErrorText: {
    fontSize: 14,
    color: '#ff4444',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardModalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  cardModalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  cardTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInputGroup: {
    marginBottom: 16,
  },
  cardInputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardBrandIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cvvInfoIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveCardCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  saveCardText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  cardErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardAmountContainer: {
    marginBottom: 16,
  },
  cardAmountLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  cardAmountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardPayButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardPayButtonGradient: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  cardCancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardCancelButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  securePaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securePaymentText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
  },
  processingIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  processingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  processingModalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  processingModalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  processingContent: {
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  processingDetails: {
    marginBottom: 20,
  },
  processingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  processingDetailText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  processingSpinner: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  walletBalanceText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  walletAmountText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  insufficientFundsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insufficientFundsText: {
    fontSize: 14,
    color: '#ff4444',
    marginLeft: 8,
  },
  walletModalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  walletModalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  walletModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  walletBalanceContainer: {
    marginBottom: 16,
  },
  walletBalanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  walletBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 12,
    width: '100%',
  },
  walletTransactionDetails: {
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  transactionValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  walletButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  walletActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  walletPayButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
  },
  walletTopUpButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: '#1a237e',
  },
  walletButtonGradient: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  walletSecondaryButton: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  walletSecondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  walletCancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  walletCancelButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  momoModalGradient: {
    padding: 20,
    borderRadius: 20,
  },
  momoModalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  momoModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  momoNumberContainer: {
    marginBottom: 16,
  },
  momoNumberLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  momoNumberInput: {
    height: 52,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  momoErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  momoErrorText: {
    fontSize: 14,
    color: '#ff0000',
    marginLeft: 8,
  },
  momoPayButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  momoPayButtonGradient: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  momoPayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  momoCancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  momoCancelButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  momoSecurityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  momoSecurityText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
  },
  momoLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  momoCountryCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  momoInputHint: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.3)',
    marginTop: 4,
  },
  momoTransactionDetails: {
    marginBottom: 16,
  },
  momoTransactionItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 12,
  },
  momoTransactionLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginBottom: 4,
  },
  momoTransactionValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  momoDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginVertical: 12,
    width: '100%',
  },
  momoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  momoInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});