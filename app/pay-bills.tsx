import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type BillProvider = 'EWSC' | 'DUPS' | 'DStv' | 'Other' | null;

interface BillInfo {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: string;
  description: string;
}

const BILL_PROVIDERS: Record<BillProvider, BillInfo> = {
  'EWSC': {
    id: 'ewsc',
    name: 'Eswatini Water Services',
    icon: 'water',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=800&auto=format&fit=crop&q=60',
    description: 'Pay your water bill',
  },
  'DUPS': {
    id: 'dups',
    name: 'Domestic Utility Payment System',
    icon: 'flash',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=60',
    description: 'Pay your electricity bill',
  },
  'DStv': {
    id: 'dstv',
    name: 'DStv Subscription',
    icon: 'tv',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60',
    description: 'Pay your DStv subscription',
  },
  'Other': {
    id: 'other',
    name: 'Other Bills',
    icon: 'receipt',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
    description: 'Pay other bills',
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PayBills() {
  const [selectedProvider, setSelectedProvider] = useState<BillProvider>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  // Animated styles for the provider cards
  const providerCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleProviderSelect = (provider: BillProvider) => {
    setSelectedProvider(provider);
    cardScale.value = withSpring(1.05, {}, () => {
      cardScale.value = withSpring(1);
    });
  };

  const validateAccountNumber = (number: string) => {
    if (selectedProvider === 'EWSC') {
      return /^\d{8}$/.test(number);
    } else if (selectedProvider === 'DUPS') {
      return /^\d{10}$/.test(number);
    } else if (selectedProvider === 'DStv') {
      return /^\d{10}$/.test(number);
    }
    return number.length > 0;
  };

  const handlePayment = async () => {
    if (!selectedProvider) {
      setError('Please select a service provider');
      return;
    }

    if (!validateAccountNumber(accountNumber)) {
      setError('Please enter a valid account number');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/(tabs)');
    } catch (err) {
      setError('Payment failed. Please try again.');
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
        <Text style={styles.headerTitle}>Pay Bills</Text>
      </Animated.View>

      {/* Service Providers */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service Provider</Text>
        <View style={styles.providersGrid}>
          {(Object.keys(BILL_PROVIDERS) as BillProvider[]).map((provider) => (
            <AnimatedPressable
              key={provider}
              style={[
                styles.providerCard,
                selectedProvider === provider && styles.selectedCard,
                providerCardStyle,
              ]}
              onPress={() => handleProviderSelect(provider)}>
              <Image
                source={{ uri: BILL_PROVIDERS[provider].image }}
                style={styles.providerImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.providerGradient}>
                <Ionicons 
                  name={BILL_PROVIDERS[provider].icon}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.providerName}>{BILL_PROVIDERS[provider].name}</Text>
                <Text style={styles.providerDescription}>
                  {BILL_PROVIDERS[provider].description}
                </Text>
              </LinearGradient>
            </AnimatedPressable>
          ))}
        </View>
      </Animated.View>

      {selectedProvider && (
        <>
          {/* Account Number Input */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(1000)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Account Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                placeholder={`Enter your ${selectedProvider} account number`}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
          </Animated.View>

          {/* Amount Input */}
          <Animated.View 
            entering={FadeInDown.delay(800).duration(1000)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>E</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
          </Animated.View>
        </>
      )}

      {/* Error Message */}
      {error && (
        <Animated.Text 
          entering={FadeIn}
          style={styles.errorText}>
          {error}
        </Animated.Text>
      )}

      {/* Pay Button */}
      <Animated.View 
        entering={FadeInDown.delay(1000).duration(1000)}
        style={styles.buttonContainer}>
        <Pressable
          style={[styles.payButton, loading && styles.loadingButton]}
          onPress={handlePayment}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#1a237e" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay {amount ? `E${amount}` : ''}
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
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  providerCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedCard: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  providerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  providerGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  providerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  providerDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
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
  inputIcon: {
    marginRight: 12,
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
  payButton: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButton: {
    opacity: 0.8,
  },
  payButtonText: {
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