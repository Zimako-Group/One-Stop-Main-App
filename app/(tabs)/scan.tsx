import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [merchantName, setMerchantName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScanResult(data);
    
    // Parse QR code data
    try {
      // Example QR code format: "merchant:name=Store Name&amount=100.00"
      const qrData = new URLSearchParams(data.split('merchant:')[1]);
      const merchantNameFromQR = qrData.get('name');
      const amountFromQR = qrData.get('amount');
      
      if (merchantNameFromQR) setMerchantName(merchantNameFromQR);
      if (amountFromQR) setAmount(amountFromQR);
      
    } catch (error) {
      console.error('Error parsing QR code:', error);
      Alert.alert('Invalid QR Code', 'The scanned code is not a valid payment QR code.');
    }
  };

  const handlePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      // Reset after showing success for a few seconds
      setTimeout(() => {
        setScanned(false);
        setScanResult(null);
        setShowSuccess(false);
        setMerchantName('');
        setAmount('');
      }, 3000);
    }, 2000);
  };

  const handleCancel = () => {
    setScanned(false);
    setScanResult(null);
    setMerchantName('');
    setAmount('');
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.permissionText}>No access to camera</Text>
        <Pressable 
          style={styles.permissionButton}
          onPress={() => BarCodeScanner.requestPermissionsAsync()}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.header}>
        <Text style={styles.headerTitle}>Scan to Pay</Text>
      </Animated.View>
      
      {/* Scanner */}
      {!scanned && (
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerTargetRow}>
                <View style={styles.scannerTargetCorner} />
                <View style={{ flex: 1 }} />
                <View style={styles.scannerTargetCorner} />
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.scannerTargetRow}>
                <View style={styles.scannerTargetCorner} />
                <View style={{ flex: 1 }} />
                <View style={styles.scannerTargetCorner} />
              </View>
            </View>
          </View>
          <Text style={styles.scanInstructions}>
            Align the QR code within the frame to scan
          </Text>
        </Animated.View>
      )}
      
      {/* Payment Confirmation */}
      {scanned && !showSuccess && (
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.confirmationCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.confirmationCardGradient}>
            <Text style={styles.confirmationTitle}>Confirm Payment</Text>
            
            <View style={styles.confirmationDetails}>
              {merchantName && (
                <View style={styles.confirmationRow}>
                  <Text style={styles.confirmationLabel}>Merchant:</Text>
                  <Text style={styles.confirmationValue}>{merchantName}</Text>
                </View>
              )}
              
              {amount && (
                <View style={styles.confirmationRow}>
                  <Text style={styles.confirmationLabel}>Amount:</Text>
                  <Text style={styles.confirmationValue}>E{amount}</Text>
                </View>
              )}
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Date:</Text>
                <Text style={styles.confirmationValue}>
                  {new Date().toLocaleDateString('en-SZ', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Time:</Text>
                <Text style={styles.confirmationValue}>
                  {new Date().toLocaleTimeString('en-SZ', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
            
            <View style={styles.confirmationActions}>
              <Pressable 
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.confirmationButton, styles.payButton]}
                onPress={handlePayment}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.payButtonText}>Pay Now</Text>
                )}
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
      
      {/* Success Message */}
      {showSuccess && (
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.successCard}>
          <LinearGradient
            colors={['rgba(76,175,80,0.2)', 'rgba(76,175,80,0.1)']}
            style={styles.successCardGradient}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4caf50" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Your payment of E{amount} to {merchantName} has been processed successfully.
            </Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
  permissionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  scannerTargetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scannerTargetCorner: {
    width: 20,
    height: 20,
    borderColor: '#ffffff',
    borderWidth: 3,
  },
  scanInstructions: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  confirmationCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmationCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationDetails: {
    marginBottom: 20,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  confirmationLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  confirmationValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  confirmationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  payButton: {
    backgroundColor: '#4caf50',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successCardGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
});
