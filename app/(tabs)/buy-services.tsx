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
type ServiceType = 'airtime' | 'data' | 'voice' | null;

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
  { id: 'esm-d1', name: '100MB', price: 8, description: 'Daily Data', validity: '24 hours' },
  { id: 'esm-d2', name: '500MB', price: 20, description: 'Weekly Data', validity: '7 days' },
  { id: 'esm-d3', name: '1GB', price: 45, description: 'Monthly Data', validity: '30 days' },
  { id: 'esm-d4', name: '5GB', price: 140, description: 'Monthly Data', validity: '30 days' },
  { id: 'esm-d5', name: '10GB', price: 230, description: 'Monthly Data', validity: '30 days' },
];

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
    return serviceType === 'data' ? ESM_DATA_PACKAGES : ESM_AIRTIME_PACKAGES;
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
    const regex = /^[76][567]\d{6}$/;
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

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/(tabs)');
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              network === 'MTN' && styles.selectedCard,
              networkCardStyle,
              { width: (width - 48) / 2 - 8 }
            ]}
            onPress={() => handleNetworkSelect('MTN')}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400' }}
              style={styles.networkLogo}
              resizeMode="contain"
            />
            <Text style={styles.networkName}>MTN Eswatini</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.networkCard,
              network === 'ESM' && styles.selectedCard,
              networkCardStyle,
              { width: (width - 48) / 2 - 8 }
            ]}
            onPress={() => handleNetworkSelect('ESM')}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400' }}
              style={styles.networkLogo}
              resizeMode="contain"
            />
            <Text style={styles.networkName}>Eswatini Mobile</Text>
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
            { type: 'airtime', icon: 'phone-portrait', label: 'Airtime' },
            { type: 'data', icon: 'wifi', label: 'Data Bundle' },
          ].map((service) => (
            <Pressable
              key={service.type}
              style={[
                styles.serviceCard,
                serviceType === service.type && styles.selectedService,
              ]}
              onPress={() => handleServiceSelect(service.type as ServiceType)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.serviceGradient}>
                <Ionicons 
                  name={service.icon as any}
                  size={32}
                  color="#fff"
                />
                <Text style={styles.serviceLabel}>{service.label}</Text>
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
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+268</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            placeholder="7612 3456"
            placeholderTextColor="rgba(255,255,255,0.5)"
            maxLength={8}
          />
        </View>
      </Animated.View>

      {/* Packages */}
      {network && serviceType && (
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(1000)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Select Package</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packagesContainer}>
            {getPackages().map((pkg) => (
              <Pressable
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage?.id === pkg.id && styles.selectedPackage,
                ]}
                onPress={() => {
                  setSelectedPackage(pkg);
                  setCustomAmount('');
                }}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                <Text style={styles.packagePrice}>E{pkg.price}</Text>
                <Text style={styles.packageValidity}>{pkg.validity}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Custom Amount */}
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
              Purchase {selectedPackage ? `(E${selectedPackage.price})` : customAmount ? `(E${customAmount})` : ''}
            </Text>
          )}
        </Pressable>
      </Animated.View>
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
  },
  networkCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  networkLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  networkName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
  },
  serviceGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedService: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#fff',
  },
  packagesContainer: {
    paddingBottom: 16,
    gap: 12,
  },
  packageCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: 120,
    alignItems: 'center',
  },
  selectedPackage: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  packageValidity: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
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
});