import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
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
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
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
          onPress={() => Camera.requestCameraPermissionsAsync()}>
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
            <CameraView
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
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
                  <ActivityIndicator color="#fff" size="small" />
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
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.successCardGradient}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            {amount && (
              <Text style={styles.successAmount}>E{amount}</Text>
            )}
            {merchantName && (
              <Text style={styles.successMerchant}>Paid to {merchantName}</Text>
            )}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    padding: 12,
  },
  scannerTargetRow: {
    flexDirection: 'row',
    height: 24,
  },
  scannerTargetCorner: {
    width: 24,
    height: 24,
    borderColor: '#fff',
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  confirmationCard: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmationCardGradient: {
    flex: 1,
    padding: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationDetails: {
    marginBottom: 32,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successCard: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  successCardGradient: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  successAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  successMerchant: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
