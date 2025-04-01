import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type TransferType = 
  | 'momo-to-emali' 
  | 'emali-to-momo' 
  | 'ewallet-to-mobile' 
  | 'mobile-to-fnb' 
  | 'bank-to-mobile'
  | null;

type TransferOption = {
  id: TransferType;
  title: string;
  description: string;
  fromIcon: string;
  toIcon: string;
  color: string;
};

export default function Transfers() {
  const params = useLocalSearchParams<{ transferType?: string }>();
  const [transferType, setTransferType] = useState<TransferType>(
    params.transferType as TransferType || null
  );
  const [amount, setAmount] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const transferOptions: TransferOption[] = [
    {
      id: 'momo-to-emali',
      title: 'MoMo to e-Mali',
      description: 'Transfer funds from MTN MoMo to Eswatini Mobile e-Mali',
      fromIcon: 'logo-google',
      toIcon: 'phone-portrait',
      color: '#ffcc00',
    },
    {
      id: 'emali-to-momo',
      title: 'e-Mali to MoMo',
      description: 'Transfer funds from Eswatini Mobile e-Mali to MTN MoMo',
      fromIcon: 'phone-portrait',
      toIcon: 'logo-google',
      color: '#e91e63',
    },
    {
      id: 'ewallet-to-mobile',
      title: 'e-Wallet to MoMo/e-Mali',
      description: 'Transfer funds from FNB e-Wallet to mobile money',
      fromIcon: 'wallet',
      toIcon: 'phone-portrait',
      color: '#4caf50',
    },
    {
      id: 'mobile-to-fnb',
      title: 'MoMo/e-Mali to FNB Account',
      description: 'Transfer funds from mobile money to FNB bank account',
      fromIcon: 'phone-portrait',
      toIcon: 'card',
      color: '#2196f3',
    },
    {
      id: 'bank-to-mobile',
      title: 'Other Banks to MoMo/e-Mali',
      description: 'Transfer funds from other local banks to mobile money',
      fromIcon: 'card',
      toIcon: 'phone-portrait',
      color: '#9c27b0',
    },
  ];

  const handleSelectTransferType = (type: TransferType) => {
    setTransferType(type);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    if (step === 2) {
      // Validate amount
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount to transfer');
        return;
      }
      
      // Validate recipient number
      if (!recipientNumber || recipientNumber.length < 8) {
        Alert.alert('Invalid Number', 'Please enter a valid recipient number');
        return;
      }
      
      setStep(3);
    } else if (step === 3) {
      // Process transfer
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 2000);
    } else if (step === 4) {
      // Reset and go back to home
      router.replace('/(tabs)');
    }
  };

  const getSelectedOption = () => {
    return transferOptions.find(option => option.id === transferType) || null;
  };

  const renderTransferOptions = () => {
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
          <Text style={styles.headerTitle}>Money Transfers</Text>
        </Animated.View>

        {/* Transfer Options */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Select Transfer Type</Text>
          <View style={styles.optionsContainer}>
            {transferOptions.map((option) => (
              <Pressable 
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleSelectTransferType(option.id)}>
                <LinearGradient
                  colors={[`${option.color}22`, `${option.color}11`]}
                  style={styles.optionCardGradient}>
                  <View style={styles.optionHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                      <Ionicons name={option.fromIcon as any} size={20} color="#fff" />
                    </View>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="arrow-forward" size={16} color={option.color} />
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                      <Ionicons name={option.toIcon as any} size={20} color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    );
  };

  const renderTransferForm = () => {
    const selectedOption = getSelectedOption();
    
    if (!selectedOption) return null;
    
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
          <Text style={styles.headerTitle}>{selectedOption.title}</Text>
        </Animated.View>

        {/* Transfer Form */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.formCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.formCardGradient}>
            
            <View style={styles.transferIconsContainer}>
              <View style={[styles.largeIconContainer, { backgroundColor: selectedOption.color }]}>
                <Ionicons name={selectedOption.fromIcon as any} size={28} color="#fff" />
              </View>
              <View style={styles.arrowLargeContainer}>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
              <View style={[styles.largeIconContainer, { backgroundColor: selectedOption.color }]}>
                <Ionicons name={selectedOption.toIcon as any} size={28} color="#fff" />
              </View>
            </View>
            
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
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Recipient Number</Text>
              <TextInput
                style={styles.formInput}
                value={recipientNumber}
                onChangeText={setRecipientNumber}
                placeholder="Enter recipient number"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Note (Optional)</Text>
              <TextInput
                style={styles.formInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
            
            <Pressable 
              style={styles.continueButton}
              onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    );
  };

  const renderConfirmation = () => {
    const selectedOption = getSelectedOption();
    
    if (!selectedOption) return null;
    
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
          <Text style={styles.headerTitle}>Confirm Transfer</Text>
        </Animated.View>

        {/* Confirmation Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.formCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.formCardGradient}>
            
            <Text style={styles.confirmationTitle}>Transfer Details</Text>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Transfer Type</Text>
              <Text style={styles.confirmationValue}>{selectedOption.title}</Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Amount</Text>
              <Text style={styles.confirmationValue}>E{amount}</Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Recipient</Text>
              <Text style={styles.confirmationValue}>{recipientNumber}</Text>
            </View>
            
            {note ? (
              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Note</Text>
                <Text style={styles.confirmationValue}>{note}</Text>
              </View>
            ) : null}
            
            <View style={styles.confirmationItem}>
              <Text style={styles.confirmationLabel}>Fee</Text>
              <Text style={styles.confirmationValue}>E2.50</Text>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>E{(parseFloat(amount) + 2.5).toFixed(2)}</Text>
            </View>
            
            <Pressable 
              style={styles.continueButton}
              onPress={handleContinue}>
              {loading ? (
                <Text style={styles.continueButtonText}>Processing...</Text>
              ) : (
                <Text style={styles.continueButtonText}>Confirm & Transfer</Text>
              )}
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    );
  };

  const renderSuccess = () => {
    const selectedOption = getSelectedOption();
    
    if (!selectedOption) return null;
    
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
          
          <Text style={styles.successTitle}>Transfer Successful!</Text>
          <Text style={styles.successMessage}>
            Your {selectedOption.title} transfer of E{amount} to {recipientNumber} has been completed successfully.
          </Text>
          
          <View style={styles.receiptContainer}>
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValue}>{Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
            </View>
            
            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Date & Time</Text>
              <Text style={styles.receiptValue}>{new Date().toLocaleString()}</Text>
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

  // Render different screens based on current step
  if (step === 1) {
    return renderTransferOptions();
  } else if (step === 2) {
    return renderTransferForm();
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
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    flex: 1,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionDescription: {
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
  transferIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  largeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLargeContainer: {
    width: 80,
    alignItems: 'center',
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
});
