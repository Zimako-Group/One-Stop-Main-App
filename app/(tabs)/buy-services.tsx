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
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

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
    validity: '30 days'
  },
  premium: {
    id: 'esm-nf2', 
    name: 'No Frills Bundle Plus', 
    price: 50, 
    description: 'Premium all-in-one bundle', 
    validity: '30 days'
  },
  ultra: {
    id: 'esm-nf3', 
    name: 'No Frills Bundle Ultra', 
    price: 100, 
    description: 'Ultra all-in-one bundle', 
    validity: '30 days'
  },
  max: {
    id: 'esm-nf4', 
    name: 'No Frills Bundle Max', 
    price: 195, 
    description: 'Maximum all-in-one bundle', 
    validity: '30 days'
  },
  ultimate: {
    id: 'esm-nf5', 
    name: 'No Frills Bundle Ultimate', 
    price: 295, 
    description: 'Ultimate all-in-one bundle', 
    validity: '30 days'
  },
  infinite: {
    id: 'esm-nf6', 
    name: 'No Frills Bundle Infinite', 
    price: 495, 
    description: 'Infinite all-in-one bundle', 
    validity: '30 days'
  }
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
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ serviceType: ServiceType }>();
  
  const [network, setNetwork] = useState<Network>(null);
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Set initial service type from params
  useEffect(() => {
    if (params.serviceType) {
      setServiceType(params.serviceType);
    }
  }, [params.serviceType]);

  // Animation values
  const scale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  // Animated styles for the network cards
  const networkCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(cardScale.value, [1, 1.05], [1, 1.05]) }],
  }));

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
    // Show confirmation modal instead of proceeding directly
    setShowConfirmModal(true);
  };

  // Handle confirm purchase
  const handleConfirmPurchase = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Generate a random transaction ID
      setTransactionId(`TRX${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
      // Show success modal
      setShowSuccessModal(true);
    }, 2000);
  };

  // Close success modal and reset form
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    // Reset form
    setNetwork(null);
    setServiceType(null);
    setSelectedPackage(null);
    setPhoneNumber('');
    setCustomAmount('');
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
                  source={require('../../assets/images/mtn-logo.jpg')}
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
                  source={require('../../assets/images/eswatini-logo.jpg')}
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
              {phoneNumber.length > 0 && (
                <Pressable 
                  style={styles.clearButton}
                  onPress={() => setPhoneNumber('')}
                >
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
                </Pressable>
              )}
            </View>
            {validatePhoneNumber(phoneNumber) && (
              <View style={styles.validIndicator}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
            )}
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
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.noFrillsBundlesContainer, { minHeight: 350 }]}>
                {/* First No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.basic.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.basic);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(25, 118, 210, 0.8)', 'rgba(21, 101, 192, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.noFrillsBadge}>
                      <Text style={styles.noFrillsBadgeText}>Basic</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle</Text>
                    <Text style={styles.noFrillsPrice}>E25</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 1GB</Text>
                      <Text style={styles.noFrillsItem}>• 500 MB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• 500 MB Nightime Data</Text>
                      <Text style={styles.noFrillsItem}>• 100 on-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 10 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 20 SMS'</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>

                {/* Second No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.premium.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.premium);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(30, 136, 229, 0.8)', 'rgba(25, 118, 210, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.noFrillsBadge}>
                      <Text style={styles.noFrillsBadgeText}>Plus</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle Plus</Text>
                    <Text style={styles.noFrillsPrice}>E50</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 2.5 GB</Text>
                      <Text style={styles.noFrillsItem}>• 1.25 GB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• 1.25 GB Nightime Data</Text>
                      <Text style={styles.noFrillsItem}>• 250 on-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 30 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 60 SMS</Text>
                      <Text style={styles.noFrillsItem}>• Unlimited On-Net minutes on weekends only</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>

                {/* Third No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.ultra.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.ultra);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(33, 150, 243, 0.8)', 'rgba(30, 136, 229, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.noFrillsBadge}>
                      <Text style={styles.noFrillsBadgeText}>Ultra</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle Ultra</Text>
                    <Text style={styles.noFrillsPrice}>E100</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 7GB</Text>
                      <Text style={styles.noFrillsItem}>• 3.5 GB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• 3.5 GB Night Data (8pm - 7am)</Text>
                      <Text style={styles.noFrillsItem}>• 300 On-net Minutes</Text>
                      <Text style={styles.noFrillsItem}>• 60 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 90 SMS'</Text>
                      <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes on Weekends only</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>

                {/* Fourth No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.max.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.max);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(3, 169, 244, 0.8)', 'rgba(33, 150, 243, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.noFrillsBadge}>
                      <Text style={styles.noFrillsBadgeText}>Max</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle Max</Text>
                    <Text style={styles.noFrillsPrice}>E195</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 15GB</Text>
                      <Text style={styles.noFrillsItem}>• 7.5 GB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• 7.5 GB Night Data (8pm - 7am)</Text>
                      <Text style={styles.noFrillsItem}>• 600 On-net Minutes</Text>
                      <Text style={styles.noFrillsItem}>• 90 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 120 SMS'</Text>
                      <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes on Weekends only</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>

                {/* Fifth No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.ultimate.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.ultimate);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(0, 188, 212, 0.8)', 'rgba(3, 169, 244, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.noFrillsBadge}>
                      <Text style={styles.noFrillsBadgeText}>Ultimate</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle Ultimate</Text>
                    <Text style={styles.noFrillsPrice}>E295</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 20GB</Text>
                      <Text style={styles.noFrillsItem}>• 10 GB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• 10 GB Night Data (8pm - 7am)</Text>
                      <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes</Text>
                      <Text style={styles.noFrillsItem}>• 100 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 180 SMS'</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>

                {/* Sixth No Frills Bundle */}
                <Pressable
                  style={[
                    styles.noFrillsCard,
                    selectedPackage?.id === ESM_NO_FRILLS_BUNDLES.infinite.id && styles.selectedPackage,
                  ]}
                  onPress={() => {
                    setSelectedPackage(ESM_NO_FRILLS_BUNDLES.infinite);
                    setCustomAmount('');
                  }}>
                  <LinearGradient
                    colors={['rgba(0, 172, 193, 0.8)', 'rgba(0, 188, 212, 0.9)']}
                    style={styles.noFrillsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[styles.noFrillsBadge, styles.infiniteBadge]}>
                      <Text style={styles.noFrillsBadgeText}>Infinite</Text>
                    </View>
                    <Text style={styles.noFrillsTitle}>No Frills Bundle Infinite</Text>
                    <Text style={styles.noFrillsPrice}>E495</Text>
                    <View style={styles.noFrillsDivider} />
                    <View style={styles.noFrillsContent}>
                      <Text style={styles.noFrillsItem}>• 48 GB Anytime Data</Text>
                      <Text style={styles.noFrillsItem}>• Unlimited On-net Minutes</Text>
                      <Text style={styles.noFrillsItem}>• 200 off-net minutes</Text>
                      <Text style={styles.noFrillsItem}>• 200 SMS'</Text>
                    </View>
                    <Text style={styles.noFrillsValidity}>Valid for 30 days</Text>
                  </LinearGradient>
                </Pressable>
              </ScrollView>
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
          disabled={loading}>
          {loading ? (
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
                    E{selectedPackage 
                      ? selectedPackage.price 
                      : customAmount 
                        ? customAmount 
                        : '0'}
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
                    E{selectedPackage 
                      ? selectedPackage.price 
                      : customAmount}
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
    width: 300,
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
    padding: 20,
    height: '100%',
  },
  noFrillsBundlesContainer: {
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
    minHeight: 350,
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
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  noFrillsItem: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
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
    paddingHorizontal: 16,
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
});