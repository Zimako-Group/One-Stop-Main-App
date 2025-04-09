import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Shop() {
  const navigateToBuyServices = (serviceType: string) => {
    router.push({
      pathname: '/buy-services',
      params: { serviceType }
    });
  };

  const handleCardPress = (type: string) => {
    switch (type) {
      case 'airtime':
        navigateToBuyServices('airtime');
        break;
      case 'tokens':
        navigateToBuyServices('electricity');
        break;
      case 'vouchers':
      case 'tickets':
      case 'store':
        // These will be implemented in future
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} feature coming soon!`);
        break;
      default:
        break;
    }
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
            <Text style={styles.headerTitle}>Shop</Text>
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
        
        {/* Shop Cards Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.shopSection}>
          <Text style={styles.sectionTitle}>What would you like to buy?</Text>
          
          <View style={styles.cardsGrid}>
            {/* Airtime Card */}
            <Pressable 
              style={styles.shopCard}
              onPress={() => handleCardPress('airtime')}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.shopCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons name="phone-portrait-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.shopCardTitle}>Airtime</Text>
              </LinearGradient>
            </Pressable>
            
            {/* Tokens (Electricity) Card */}
            <Pressable 
              style={styles.shopCard}
              onPress={() => handleCardPress('tokens')}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.shopCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons name="flash-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.shopCardTitle}>Tokens</Text>
              </LinearGradient>
            </Pressable>
            
            {/* Vouchers Card */}
            <Pressable 
              style={styles.shopCard}
              onPress={() => handleCardPress('vouchers')}>
              <LinearGradient
                colors={['#9C27B0', '#7B1FA2']}
                style={styles.shopCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons name="gift-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.shopCardTitle}>Vouchers</Text>
              </LinearGradient>
            </Pressable>
            
            {/* Tickets Card */}
            <Pressable 
              style={styles.shopCard}
              onPress={() => handleCardPress('tickets')}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.shopCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons name="ticket-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.shopCardTitle}>Tickets</Text>
              </LinearGradient>
            </Pressable>
            
            {/* Online Store Card */}
            <Pressable 
              style={styles.shopCard}
              onPress={() => handleCardPress('store')}>
              <LinearGradient
                colors={['#E91E63', '#C2185B']}
                style={styles.shopCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shopIconContainer}>
                  <Ionicons name="basket-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.shopCardTitle}>Online Store</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
        
        {/* Popular Items Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="star" size={20} color="#FFD700" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Popular Items</Text>
            </View>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </Pressable>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularItemsContainer}>
            
            {/* MTN 10 Airtime */}
            <Pressable 
              style={styles.popularItem}
              onPress={() => navigateToBuyServices('airtime')}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.popularItemGradient}>
                <View style={styles.popularItemContent}>
                  <View style={styles.popularItemIconContainer}>
                    <Ionicons name="phone-portrait" size={24} color="#fff" />
                  </View>
                  <View style={styles.popularItemDetails}>
                    <Text style={styles.popularItemTitle}>MTN E10</Text>
                    <Text style={styles.popularItemPrice}>E10.00</Text>
                  </View>
                  <View style={styles.popularItemBadge}>
                    <Text style={styles.popularItemBadgeText}>Popular</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Electricity 50 */}
            <Pressable 
              style={styles.popularItem}
              onPress={() => navigateToBuyServices('electricity')}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.popularItemGradient}>
                <View style={styles.popularItemContent}>
                  <View style={styles.popularItemIconContainer}>
                    <Ionicons name="flash" size={24} color="#fff" />
                  </View>
                  <View style={styles.popularItemDetails}>
                    <Text style={styles.popularItemTitle}>Electricity</Text>
                    <Text style={styles.popularItemPrice}>E50.00</Text>
                  </View>
                  <View style={[styles.popularItemBadge, styles.bestValueBadge]}>
                    <Text style={[styles.popularItemBadgeText, styles.bestValueText]}>Best Value</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Data Bundle */}
            <Pressable 
              style={styles.popularItem}
              onPress={() => navigateToBuyServices('data')}>
              <LinearGradient
                colors={['#2196F3', '#1565C0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.popularItemGradient}>
                <View style={styles.popularItemContent}>
                  <View style={styles.popularItemIconContainer}>
                    <Ionicons name="wifi" size={24} color="#fff" />
                  </View>
                  <View style={styles.popularItemDetails}>
                    <Text style={styles.popularItemTitle}>1GB Data</Text>
                    <Text style={styles.popularItemPrice}>E99.00</Text>
                  </View>
                  <View style={[styles.popularItemBadge, styles.hotDealBadge]}>
                    <Text style={[styles.popularItemBadgeText, styles.hotDealText]}>Hot Deal</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Water Bill */}
            <Pressable 
              style={styles.popularItem}
              onPress={() => navigateToBuyServices('water')}>
              <LinearGradient
                colors={['#03A9F4', '#0277BD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.popularItemGradient}>
                <View style={styles.popularItemContent}>
                  <View style={styles.popularItemIconContainer}>
                    <Ionicons name="water" size={24} color="#fff" />
                  </View>
                  <View style={styles.popularItemDetails}>
                    <Text style={styles.popularItemTitle}>Water Bill</Text>
                    <Text style={styles.popularItemPrice}>E100.00</Text>
                  </View>
                  <View style={[styles.popularItemBadge, styles.newBadge]}>
                    <Text style={[styles.popularItemBadgeText, styles.newText]}>New</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </ScrollView>
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
  shopSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopCardGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  shopIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shopCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  popularSection: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
  popularItemsContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  popularItem: {
    width: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 8,
  },
  popularItemGradient: {
    height: 180,
    borderRadius: 16,
  },
  popularItemContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  popularItemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  popularItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  popularItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  popularItemPrice: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  popularItemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  popularItemBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  bestValueBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  bestValueText: {
    color: '#fff',
  },
  hotDealBadge: {
    backgroundColor: 'rgba(255, 87, 34, 0.25)',
    borderColor: 'rgba(255, 87, 34, 0.5)',
  },
  hotDealText: {
    color: '#fff',
  },
  newBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.25)',
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  newText: {
    color: '#fff',
  },
});
