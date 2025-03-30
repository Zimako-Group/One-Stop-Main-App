import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// Define top-up method types
type TopUpMethod = 'mtn_momo' | 'bank_transfer' | null;

// Card types
type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export default function TopUp() {
  const [step, setStep] = useState(1);
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<CardType>('visa');
  const [saveCard, setSaveCard] = useState(false);

  // Handle back navigation
  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  // Handle method selection
  const handleSelectMethod = (method: TopUpMethod) => {
    setTopUpMethod(method);
    setStep(2);
  };

  // Handle continue button
  const handleContinue = () => {
    if (step === 2) {
      // Validate inputs
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount');
        return;
      }

      if (topUpMethod === 'mtn_momo' && (!phoneNumber || phoneNumber.length < 8)) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
        return;
      }

      // Generate a reference number
      setReference(`TOP${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
      setStep(3);
    } else if (step === 3) {
      // Process payment
      setLoading(true);
      
      // Simulate API call to MTN MoMo
      if (topUpMethod === 'mtn_momo') {
        // Placeholder for MTN MoMo API integration
        initiateTopUpWithMoMo();
      } else if (topUpMethod === 'bank_transfer') {
        // Placeholder for bank transfer processing
        processBankTransfer();
      }
    } else if (step === 4) {
      // Return to home
      router.replace('/(tabs)');
    }
  };

  // Placeholder for MTN MoMo API integration
  const initiateTopUpWithMoMo = () => {
    // TODO: Integrate with MTN MoMo API
    
    /**
     * MTN MoMo API Integration would typically involve:
     * 1. Creating a collection request
     * 2. Sending the request to MTN API
     * 3. Handling the callback/response
     * 
     * Example API call structure:
     * 
     * const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';
     * const headers = {
     *   'Authorization': `Bearer ${accessToken}`,
     *   'X-Reference-Id': reference,
     *   'X-Target-Environment': 'sandbox', // or 'production'
     *   'Content-Type': 'application/json',
     *   'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY
     * };
     * 
     * const requestBody = {
     *   amount: amount,
     *   currency: 'SZL',
     *   externalId: reference,
     *   payer: {
     *     partyIdType: 'MSISDN',
     *     partyId: phoneNumber
     *   },
     *   payerMessage: 'Top up One-Stop wallet',
     *   payeeNote: 'Payment for wallet top up'
     * };
     * 
     * fetch(apiUrl, {
     *   method: 'POST',
     *   headers: headers,
     *   body: JSON.stringify(requestBody)
     * })
     * .then(response => {
     *   // Handle response
     * })
     * .catch(error => {
     *   // Handle error
     * });
     */
    
    // For now, simulate a successful API call
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      
      // Update wallet balance in a real implementation
      // This would typically be done after confirming the payment was successful
    }, 2000);
  };

  // Placeholder for bank transfer processing
  const processBankTransfer = () => {
    // TODO: Implement bank transfer processing
    
    /**
     * Bank transfer integration would typically involve:
     * 1. Validating card details
     * 2. Sending card details to a payment processor (e.g., Stripe, PayPal, etc.)
     * 3. Handling the payment response
     * 4. Updating the wallet balance on success
     * 
     * Example API call:
     * 
     * const apiUrl = 'https://api.payment-processor.com/process-payment';
     * const requestBody = {
     *   amount: amount,
     *   currency: 'SZL',
     *   card: {
     *     number: cardNumber.replace(/\s/g, ''),
     *     exp_month: parseInt(expiryDate.split('/')[0]),
     *     exp_year: parseInt(expiryDate.split('/')[1]),
     *     cvc: cvv,
     *     name: cardholderName
     *   },
     *   description: `Top up One-Stop wallet - ${reference}`,
     *   metadata: {
     *     reference: reference
     *   }
     * };
     * 
     * fetch(apiUrl, {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': `Bearer ${API_KEY}`,
     *     'Content-Type': 'application/json'
     *   },
     *   body: JSON.stringify(requestBody)
     * })
     * .then(response => response.json())
     * .then(data => {
     *   if (data.success) {
     *     // Update wallet balance
     *     setLoading(false);
     *     setStep(4);
     *   } else {
     *     // Handle error
     *     setLoading(false);
     *     Alert.alert('Payment Failed', data.error.message);
     *   }
     * })
     * .catch(error => {
     *   setLoading(false);
     *   Alert.alert('Error', 'An error occurred while processing your payment');
     *   console.error('Error processing payment:', error);
     * });
     */
    
    // For now, simulate a successful transfer
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Detect card type based on number
  const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, '');
    
    // Visa cards start with 4
    if (/^4/.test(cleaned)) return 'visa';
    
    // Mastercard cards start with 51-55 or 2221-2720
    if (/^5[1-5]/.test(cleaned) || /^(222[1-9]|22[3-9]\d|2[3-6]\d\d|27[0-1]\d|2720)/.test(cleaned)) return 'mastercard';
    
    // American Express cards start with 34 or 37
    if (/^3[47]/.test(cleaned)) return 'amex';
    
    // Discover cards start with 6011, 622126-622925, 644-649, or 65
    if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d\d|9[01]\d|92[0-5]))/.test(cleaned)) return 'discover';
    
    return 'other';
  };

  // Validate card details
  const validateCardDetails = (): boolean => {
    // Validate card number (should be 16 digits for most cards, 15 for Amex)
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length < 15 || cleanedCardNumber.length > 16) {
      Alert.alert('Invalid Card Number', 'Please enter a valid card number');
      return false;
    }
    
    // Validate expiry date
    const [month, year] = expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    
    if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      Alert.alert('Card Expired', 'Your card has expired. Please use a different card.');
      return false;
    }
    
    // Validate CVV (3 digits for most cards, 4 for Amex)
    const expectedCvvLength = cardType === 'amex' ? 4 : 3;
    if (cvv.length !== expectedCvvLength) {
      Alert.alert('Invalid CVV', `Please enter a valid ${expectedCvvLength}-digit CVV code`);
      return false;
    }
    
    // Validate cardholder name
    if (!cardholderName.trim()) {
      Alert.alert('Invalid Name', 'Please enter the cardholder name');
      return false;
    }
    
    return true;
  };

  // Render method selection screen
  const renderMethodSelection = () => {
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
            onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Top Up Balance</Text>
        </Animated.View>

        {/* Method Selection */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Select Top-Up Method</Text>
          <View style={styles.methodsContainer}>
            <Pressable 
              style={styles.methodCard}
              onPress={() => handleSelectMethod('mtn_momo')}>
              <LinearGradient
                colors={['rgba(255,204,0,0.2)', 'rgba(255,204,0,0.1)']}
                style={styles.methodCardGradient}>
                <View style={[styles.methodIconContainer, { backgroundColor: '#ffcc00' }]}>
                  <Ionicons name="phone-portrait" size={24} color="#fff" />
                </View>
                <Text style={styles.methodTitle}>MTN MoMo</Text>
                <Text style={styles.methodDescription}>Top up using MTN Mobile Money</Text>
              </LinearGradient>
            </Pressable>

            <Pressable 
              style={styles.methodCard}
              onPress={() => handleSelectMethod('bank_transfer')}>
              <LinearGradient
                colors={['rgba(33,150,243,0.2)', 'rgba(33,150,243,0.1)']}
                style={styles.methodCardGradient}>
                <View style={[styles.methodIconContainer, { backgroundColor: '#2196f3' }]}>
                  <Ionicons name="card" size={24} color="#fff" />
                </View>
                <Text style={styles.methodTitle}>Bank Transfer</Text>
                <Text style={styles.methodDescription}>Top up using bank transfer</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    );
  };

  // Render amount input screen
  const renderAmountInput = () => {
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
            onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {topUpMethod === 'mtn_momo' ? 'MTN MoMo Top Up' : 'Bank Transfer'}
          </Text>
        </Animated.View>

        {/* Amount Input Form */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.formCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.formCardGradient}>
            <Text style={styles.formTitle}>Enter Top-Up Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amount (E)</Text>
              <TextInput
                style={styles.formInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="numeric"
              />
            </View>
            
            {topUpMethod === 'mtn_momo' ? (
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter MTN number"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <>
                <View style={styles.cardTypeContainer}>
                  <Text style={styles.formLabel}>Card Type</Text>
                  <View style={styles.cardTypeOptions}>
                    <Pressable 
                      style={[styles.cardTypeOption, cardType === 'visa' && styles.cardTypeSelected]}
                      onPress={() => setCardType('visa')}>
                      <Text style={styles.cardTypeText}>Visa</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.cardTypeOption, cardType === 'mastercard' && styles.cardTypeSelected]}
                      onPress={() => setCardType('mastercard')}>
                      <Text style={styles.cardTypeText}>Mastercard</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.cardTypeOption, cardType === 'amex' && styles.cardTypeSelected]}
                      onPress={() => setCardType('amex')}>
                      <Text style={styles.cardTypeText}>Amex</Text>
                    </Pressable>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Card Number</Text>
                  <View style={styles.cardNumberContainer}>
                    <TextInput
                      style={styles.formInput}
                      value={cardNumber}
                      onChangeText={(text) => {
                        const formatted = formatCardNumber(text);
                        setCardNumber(formatted);
                        setCardType(detectCardType(formatted));
                      }}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                      maxLength={19}
                    />
                    <View style={styles.cardIconContainer}>
                      <Ionicons 
                        name={
                          cardType === 'visa' ? 'card' : 
                          cardType === 'mastercard' ? 'card' : 
                          cardType === 'amex' ? 'card' : 
                          'card-outline'
                        } 
                        size={24} 
                        color={
                          cardType === 'visa' ? '#1A1F71' : 
                          cardType === 'mastercard' ? '#EB001B' : 
                          cardType === 'amex' ? '#006FCF' : 
                          '#fff'
                        } 
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cardholder Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={cardholderName}
                    onChangeText={setCardholderName}
                    placeholder="Name on card"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    autoCapitalize="words"
                  />
                </View>
                
                <View style={styles.cardDetailsRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.formLabel}>Expiry Date</Text>
                    <TextInput
                      style={styles.formInput}
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                      placeholder="MM/YY"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <TextInput
                      style={styles.formInput}
                      value={cvv}
                      onChangeText={setCvv}
                      placeholder={cardType === 'amex' ? "4 digits" : "3 digits"}
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                      maxLength={cardType === 'amex' ? 4 : 3}
                      secureTextEntry
                    />
                  </View>
                </View>
                
                <Pressable 
                  style={styles.saveCardContainer}
                  onPress={() => setSaveCard(!saveCard)}>
                  <View style={[
                    styles.checkbox, 
                    saveCard ? { backgroundColor: 'rgba(255,255,255,0.3)' } : null
                  ]}>
                    {saveCard && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={styles.saveCardText}>Save card for future payments</Text>
                </Pressable>
              </>
            )}
            
            <Pressable 
              style={styles.continueButton}
              onPress={() => {
                if (topUpMethod === 'bank_transfer' && !validateCardDetails()) {
                  return;
                }
                handleContinue();
              }}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    );
  };

  // Render confirmation screen
  const renderConfirmation = () => {
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
            onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Confirm Top-Up</Text>
        </Animated.View>

        {/* Confirmation Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.formCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.formCardGradient}>
            <Text style={styles.confirmationTitle}>Top-Up Details</Text>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Method</Text>
              <Text style={styles.confirmationValue}>
                {topUpMethod === 'mtn_momo' ? 'MTN MoMo' : 'Bank Card'}
              </Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Amount</Text>
              <Text style={styles.confirmationValue}>E{amount}</Text>
            </View>
            
            {topUpMethod === 'mtn_momo' ? (
              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Phone Number</Text>
                <Text style={styles.confirmationValue}>{phoneNumber}</Text>
              </View>
            ) : (
              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Card</Text>
                <Text style={styles.confirmationValue}>
                  {cardType.charAt(0).toUpperCase() + cardType.slice(1)} •••• {cardNumber.slice(-4)}
                </Text>
              </View>
            )}
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Reference</Text>
              <Text style={styles.confirmationValue}>{reference}</Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Fee</Text>
              <Text style={styles.confirmationValue}>
                {topUpMethod === 'bank_transfer' ? 'E5.00' : 'E0.00'}
              </Text>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                E{(parseFloat(amount) + (topUpMethod === 'bank_transfer' ? 5 : 0)).toFixed(2)}
              </Text>
            </View>
            
            <Pressable 
              style={styles.continueButton}
              onPress={handleContinue}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#1a237e" />
                  <Text style={[styles.continueButtonText, styles.loadingText]}>
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text style={styles.continueButtonText}>Confirm & Pay</Text>
              )}
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    );
  };

  // Render success screen
  const renderSuccess = () => {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />

        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.successTitle}>Top-Up Successful!</Text>
          <Text style={styles.successMessage}>
            Your wallet has been topped up with E{amount} successfully.
          </Text>
          
          <View style={styles.receiptContainer}>
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValue}>{reference}</Text>
            </View>
            
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Date & Time</Text>
              <Text style={styles.receiptValue}>{new Date().toLocaleString()}</Text>
            </View>
            
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Method</Text>
              <Text style={styles.receiptValue}>
                {topUpMethod === 'mtn_momo' ? 'MTN MoMo' : 'Bank Transfer'}
              </Text>
            </View>
            
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Text style={[styles.receiptValue, { color: '#4CAF50' }]}>Completed</Text>
            </View>
          </View>
          
          <Pressable 
            style={styles.doneButton}
            onPress={handleContinue}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  // Render the appropriate screen based on current step
  if (step === 1) {
    return renderMethodSelection();
  } else if (step === 2) {
    return renderAmountInput();
  } else if (step === 3) {
    return renderConfirmation();
  } else {
    return renderSuccess();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  gradient: {
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  methodsContainer: {
    gap: 16,
  },
  methodCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  methodCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  formCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  formCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  confirmationValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  receiptContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  receiptValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTypeContainer: {
    marginBottom: 20,
  },
  cardTypeOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cardTypeOption: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardTypeSelected: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardTypeText: {
    color: '#fff',
    fontSize: 14,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    position: 'absolute',
    right: 16,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  saveCardText: {
    color: '#fff',
    fontSize: 14,
  },
});
