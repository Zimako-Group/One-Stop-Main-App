import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router, Stack } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../src/contexts/WalletContext';

export default function ScanToPay() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { balance, deductFromWallet } = useWallet();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      // Parse the QR code data
      const paymentData = JSON.parse(data);
      
      if (paymentData && paymentData.amount && paymentData.recipient) {
        // Show confirmation dialog
        Alert.alert(
          "Payment Confirmation",
          `Pay E${paymentData.amount} to ${paymentData.recipient}?`,
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => setScanned(false)
            },
            {
              text: "Pay",
              onPress: () => processPayment(paymentData)
            }
          ]
        );
      } else {
        Alert.alert(
          "Invalid QR Code",
          "The scanned QR code is not a valid payment code.",
          [
            {
              text: "Try Again",
              onPress: () => setScanned(false)
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Invalid QR Code",
        "The scanned QR code is not a valid payment code.",
        [
          {
            text: "Try Again",
            onPress: () => setScanned(false)
          }
        ]
      );
    }
  };

  const processPayment = async (paymentData: { amount: number; recipient: string }) => {
    // Check if user has enough balance
    if (balance >= paymentData.amount) {
      // Process the payment using the deductFromWallet function
      const success = await deductFromWallet(
        paymentData.amount,
        `Payment to ${paymentData.recipient}`,
        'purchase'
      );
      
      if (success) {
        // Show success message
        Alert.alert(
          "Payment Successful",
          `You've paid E${paymentData.amount} to ${paymentData.recipient}`,
          [
            {
              text: "Done",
              onPress: () => router.back()
            }
          ]
        );
      } else {
        // This shouldn't happen since we already checked the balance
        Alert.alert(
          "Payment Failed",
          "There was an error processing your payment. Please try again.",
          [
            {
              text: "OK",
              onPress: () => setScanned(false)
            }
          ]
        );
      }
    } else {
      // Show insufficient funds message
      Alert.alert(
        "Insufficient Funds",
        `Your balance (E${balance.toFixed(2)}) is not enough for this payment (E${paymentData.amount})`,
        [
          {
            text: "Top Up",
            onPress: () => router.push('/top-up')
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setScanned(false)
          }
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={[StyleSheet.absoluteFill, styles.backgroundGradient]}
        />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={[StyleSheet.absoluteFill, styles.backgroundGradient]}
        />
        <Text style={styles.text}>No access to camera</Text>
        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Scan to Pay',
        headerStyle: {
          backgroundColor: '#1a237e',
        },
        headerTintColor: '#fff',
      }} />
      
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
        
        <View style={styles.overlay}>
          <View style={styles.unfilled} />
          <View style={styles.scannerRow}>
            <View style={styles.unfilled} />
            <View style={styles.scanner}>
              <View style={[styles.scannerCorner, styles.scannerCornerTL]} />
              <View style={[styles.scannerCorner, styles.scannerCornerTR]} />
              <View style={[styles.scannerCorner, styles.scannerCornerBL]} />
              <View style={[styles.scannerCorner, styles.scannerCornerBR]} />
            </View>
            <View style={styles.unfilled} />
          </View>
          <View style={styles.unfilled}>
            <Text style={styles.scanText}>Align QR code within the frame</Text>
          </View>
        </View>
        
        <View style={styles.controlsContainer}>
          <Pressable 
            style={styles.controlButton}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.controlButtonGradient}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
      
      {scanned && (
        <Pressable
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.scanAgainGradient}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundGradient: {
    height: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  unfilled: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerRow: {
    flexDirection: 'row',
    height: 250,
  },
  scanner: {
    width: 250,
    height: 250,
    borderRadius: 16,
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  scannerCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 16,
  },
  scannerCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 16,
  },
  scannerCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 16,
  },
  scannerCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 16,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  controlButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scanAgainGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
