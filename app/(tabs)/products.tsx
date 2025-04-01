import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Products() {
  const handleCardPress = (type: string) => {
    // These will be implemented in future
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} feature coming soon!`);
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
            <Text style={styles.headerTitle}>Financial Products</Text>
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
        
        {/* Products Cards Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Financial Solutions</Text>
          
          <View style={styles.cardsContainer}>
            {/* Loans Card */}
            <Pressable 
              style={styles.productCard}
              onPress={() => handleCardPress('loans')}>
              <LinearGradient
                colors={['#4A148C', '#7B1FA2']}
                style={styles.productCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="cash-outline" size={32} color="#fff" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Loans</Text>
                    <Text style={styles.cardDescription}>
                      Quick access to personal and business loans with competitive rates
                    </Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Apply Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Savings Card */}
            <Pressable 
              style={styles.productCard}
              onPress={() => handleCardPress('savings')}>
              <LinearGradient
                colors={['#00695C', '#00897B']}
                style={styles.productCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="wallet-outline" size={32} color="#fff" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Savings</Text>
                    <Text style={styles.cardDescription}>
                      Grow your money with our high-interest savings accounts
                    </Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Start Saving</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Insurance Card */}
            <Pressable 
              style={styles.productCard}
              onPress={() => handleCardPress('insurance')}>
              <LinearGradient
                colors={['#01579B', '#0288D1']}
                style={styles.productCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="shield-outline" size={32} color="#fff" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Insurance</Text>
                    <Text style={styles.cardDescription}>
                      Protect what matters with our comprehensive insurance plans
                    </Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Get Coverage</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
        
        {/* Featured Product Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Product</Text>
          
          <Pressable 
            style={styles.featuredCard}
            onPress={() => handleCardPress('personal-loan')}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.featuredCardGradient}>
              <View style={styles.featuredCardContent}>
                <View style={styles.featuredTextContainer}>
                  <Text style={styles.featuredLabel}>Limited Time Offer</Text>
                  <Text style={styles.featuredTitle}>Personal Loan</Text>
                  <Text style={styles.featuredDescription}>
                    Get up to E50,000 with reduced interest rates and flexible repayment options
                  </Text>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateValue}>12%</Text>
                    <Text style={styles.rateLabel}>Interest Rate</Text>
                  </View>
                  <View style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Learn More</Text>
                  </View>
                </View>
                <View style={styles.featuredImageContainer}>
                  <View style={styles.featuredIconCircle}>
                    <Ionicons name="trending-up" size={48} color="#fff" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
        
        {/* Financial Tips Section */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(1000)}
          style={styles.tipsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Tips</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsContainer}>
            
            <Pressable style={styles.tipCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.tipCardGradient}>
                <View style={styles.tipIconContainer}>
                  <Ionicons name="bulb-outline" size={24} color="#FFD54F" />
                </View>
                <Text style={styles.tipTitle}>Save Smarter</Text>
                <Text style={styles.tipDescription}>
                  Set up automatic transfers to your savings account each month
                </Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.tipCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.tipCardGradient}>
                <View style={styles.tipIconContainer}>
                  <Ionicons name="bulb-outline" size={24} color="#FFD54F" />
                </View>
                <Text style={styles.tipTitle}>Debt Management</Text>
                <Text style={styles.tipDescription}>
                  Pay off high-interest debt first to save money in the long run
                </Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable style={styles.tipCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.tipCardGradient}>
                <View style={styles.tipIconContainer}>
                  <Ionicons name="bulb-outline" size={24} color="#FFD54F" />
                </View>
                <Text style={styles.tipTitle}>Emergency Fund</Text>
                <Text style={styles.tipDescription}>
                  Aim to save 3-6 months of expenses for unexpected situations
                </Text>
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
  productsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  productCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  productCardGradient: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  cardFooterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  featuredSection: {
    padding: 24,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredCardGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featuredCardContent: {
    padding: 24,
    flexDirection: 'row',
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  rateContainer: {
    marginBottom: 16,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rateLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  featuredButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsSection: {
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
  tipsContainer: {
    paddingRight: 16,
  },
  tipCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipCardGradient: {
    padding: 16,
    height: 160,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 213, 79, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
});
