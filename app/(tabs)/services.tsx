import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const navigateToBillPayments = (type: 'utility' | 'other') => {
    router.push({
      pathname: '/pay-bills',
      params: { billType: type }
    });
  };

  const navigateToBookings = () => {
    // Will be implemented in future
    alert('Booking service coming soon!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#01579b']}
        style={[StyleSheet.absoluteFill, styles.backgroundGradient]}
      />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#1a237e', '#1a237e']}
          style={styles.headerBackground}
        />
        <Animated.View 
          entering={FadeInDown.delay(200).duration(1000)}
          style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Services</Text>
            <Pressable 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.profileButtonGradient}>
                <Ionicons name="person-outline" size={24} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        
        {/* Service Cards Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Select a Service</Text>
          
          {/* Utility Bill Payments */}
          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigateToBillPayments('utility')}>
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              style={styles.serviceCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="flash-outline" size={32} color="#fff" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Utility Bill Payments</Text>
                <Text style={styles.serviceDescription}>Pay for electricity, water, and other utilities</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
          
          {/* Other Bill Payments */}
          <Pressable 
            style={styles.serviceCard}
            onPress={() => navigateToBillPayments('other')}>
            <LinearGradient
              colors={['#2196F3', '#0D47A1']}
              style={styles.serviceCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="receipt-outline" size={32} color="#fff" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Other Bill Payments</Text>
                <Text style={styles.serviceDescription}>Pay for TV subscriptions, internet, and more</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
          
          {/* Bookings */}
          <Pressable 
            style={styles.serviceCard}
            onPress={navigateToBookings}>
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.serviceCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="calendar-outline" size={32} color="#fff" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Bookings</Text>
                <Text style={styles.serviceDescription}>Book tickets, appointments, and reservations</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
        </Animated.View>
        
        {/* Recent Transactions Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={() => router.push('/transaction-history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          
          {/* Transaction List */}
          <View style={styles.transactionList}>
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="flash" size={20} color="#4CAF50" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Electricity Bill</Text>
                <Text style={styles.transactionDate}>28 Mar 2025</Text>
              </View>
              <Text style={styles.transactionAmount}>-E120.00</Text>
            </View>
            
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="tv" size={20} color="#2196F3" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>DStv Subscription</Text>
                <Text style={styles.transactionDate}>15 Mar 2025</Text>
              </View>
              <Text style={styles.transactionAmount}>-E250.00</Text>
            </View>
            
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="water" size={20} color="#FF9800" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>Water Bill</Text>
                <Text style={styles.transactionDate}>10 Mar 2025</Text>
              </View>
              <Text style={styles.transactionAmount}>-E85.00</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    height: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 36,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    marginTop: 4,
  },
  profileButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 24,
  },
  servicesSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  recentSection: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  transactionList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5252',
  },
});
