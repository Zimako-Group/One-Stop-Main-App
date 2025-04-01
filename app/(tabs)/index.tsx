import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { useWallet } from '../../src/contexts/WalletContext';

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const { balance } = useWallet();
  const [showBalance, setShowBalance] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    // TODO: Implement logout logic
    router.replace('/(auth)');
  };

  const navigateToBuyServices = (serviceType: 'airtime' | 'data' | null = null) => {
    router.push({
      pathname: '/buy-services',
      params: { serviceType }
    });
  };

  const navigateToPayBills = () => {
    router.push('/pay-bills');
  };

  const navigateToTransfers = (transferType: string | null = null) => {
    router.push({
      pathname: '/transfers',
      params: { transferType }
    });
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
            <View>
              <Text style={styles.greeting}>Sawubona! 👋</Text>
              <Text style={styles.subGreeting}>Welcome back</Text>
            </View>
            <Pressable 
              style={styles.profileButton}
              onPress={() => setShowMenu(true)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.profileButtonGradient}>
                <Ionicons name="person-outline" size={24} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.cardContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.card}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <View style={styles.balanceIcons}>
                <Pressable 
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showBalance ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255,255,255,0.9)" 
                  />
                </Pressable>
                <Ionicons name="wallet-outline" size={20} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
            <View style={styles.balanceRow}>
              {showBalance ? (
                <Text style={styles.balanceAmount}>E{balance.toFixed(2)}</Text>
              ) : (
                <Text style={styles.balanceAmount}>E ••••••</Text>
              )}
              <Pressable 
                style={styles.topUpButton}
                onPress={() => router.push('/top-up')}>
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.topUpGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.topUpContent}>
                    <Ionicons name="add-circle-outline" size={14} color="#fff" />
                    <Text style={styles.topUpButtonText}>Top Up</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions Card */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(1000)}
          style={styles.cardContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.quickActionsCard}>
            <View style={styles.quickActionsContainer}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => navigateToTransfers('send')}>
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="paper-plane" size={20} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>Send Money</Text>
              </Pressable>

              <Pressable 
                style={styles.quickActionButton}
                onPress={() => router.push('/scan-to-pay')}>
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="qr-code-outline" size={20} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>Scan to Pay</Text>
              </Pressable>

              <Pressable 
                style={styles.quickActionButton}
                onPress={() => navigateToTransfers('withdraw')}>
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="cash-outline" size={20} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>Withdraw</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {/* Buy Airtime/Data Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.airtimeSection}>
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.airtimeContainer}>
            <Pressable 
              style={styles.buyButton}
              onPress={() => navigateToBuyServices()}>
              <View style={styles.buyButtonContent}>
                <View style={styles.buyButtonLeft}>
                  <Ionicons name="phone-portrait-outline" size={24} color="#1a237e" style={styles.buyButtonIcon} />
                  <Text style={styles.buyButtonText}>Buy Airtime/Data</Text>
                </View>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']}
                  style={styles.buyButtonArrow}>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </LinearGradient>
              </View>
            </Pressable>

            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            
            <View style={styles.quickActions}>
              <Pressable 
                style={styles.actionButton}
                onPress={() => navigateToBuyServices('airtime')}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']}
                  style={styles.actionIconContainer}>
                  <Ionicons name="phone-portrait" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionText}>Airtime</Text>
              </Pressable>

              <Pressable 
                style={styles.actionButton}
                onPress={() => navigateToBuyServices('data')}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']}
                  style={styles.actionIconContainer}>
                  <Ionicons name="wifi" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionText}>Data</Text>
              </Pressable>

              <Pressable 
                style={styles.actionButton}
                onPress={navigateToPayBills}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']}
                  style={styles.actionIconContainer}>
                  <Ionicons name="receipt" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionText}>Pay Bills</Text>
              </Pressable>

              <Pressable 
                style={styles.actionButton}
                onPress={() => navigateToTransfers()}>
                <LinearGradient
                  colors={['#1a237e', '#0d47a1']}
                  style={styles.actionIconContainer}>
                  <Ionicons name="swap-horizontal" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionText}>Transfer</Text>
              </Pressable>
            </View>

            {/* Recent Transactions Section */}
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Recent Transactions</Text>
              <Pressable onPress={() => router.push('/transaction-history')}>
                <Text style={styles.viewAllButton}>View All</Text>
              </Pressable>
            </View>

            <View style={styles.transactionsList}>
              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIconContainer}>
                    <Ionicons name="wifi" size={20} color="#1a237e" />
                  </View>
                  <View>
                    <Text style={styles.transactionTitle}>1GB Data Bundle</Text>
                    <Text style={styles.transactionSubtitle}>MTN Eswatini</Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>-E99.00</Text>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIconContainer}>
                    <Ionicons name="phone-portrait" size={20} color="#1a237e" />
                  </View>
                  <View>
                    <Text style={styles.transactionTitle}>Airtime Top Up</Text>
                    <Text style={styles.transactionSubtitle}>MTN Eswatini</Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>-E50.00</Text>
              </View>

              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIconContainer}>
                    <Ionicons name="call" size={20} color="#1a237e" />
                  </View>
                  <View>
                    <Text style={styles.transactionTitle}>Voice Bundle</Text>
                    <Text style={styles.transactionSubtitle}>MTN Eswatini</Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>-E75.00</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Profile Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}>
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}>
          <Pressable style={styles.menuContainer}>
            <LinearGradient
              colors={['#fff', '#f8f9fa']}
              style={styles.menu}>
              <Pressable style={styles.menuItem} onPress={() => {
                setShowMenu(false);
                router.push('/profile');
              }}>
                <Ionicons name="person-outline" size={24} color="#1a237e" />
                <Text style={styles.menuItemText}>Profile</Text>
              </Pressable>
              
              <Pressable style={styles.menuItem} onPress={() => {
                setShowMenu(false);
                router.push('/settings');
              }}>
                <Ionicons name="settings-outline" size={24} color="#1a237e" />
                <Text style={styles.menuItemText}>Settings</Text>
              </Pressable>
              
              <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#dc3545" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
              </Pressable>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
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
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    right: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menu: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '600',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#dc3545',
  },
  cardContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 16,
  },
  balanceIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginRight: 8,
  },
  topUpButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  topUpGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  topUpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topUpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 320,
  },
  airtimeSection: {
    flex: 1,
  },
  airtimeContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 600,
  },
  buyButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  buyButtonIcon: {
    marginRight: 12,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  buyButtonArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: '#1a237e',
    textAlign: 'center',
    fontWeight: '600',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  viewAllButton: {
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 35, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  quickActionsCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionButton: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 35, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});