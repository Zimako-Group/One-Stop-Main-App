import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Rewards() {
  const [points, setPoints] = useState(750);
  
  const handleRedeemPress = (reward: string, pointsCost: number) => {
    if (points >= pointsCost) {
      alert(`You've successfully redeemed ${reward}! Check your wallet for the reward.`);
      setPoints(points - pointsCost);
    } else {
      alert(`You need ${pointsCost - points} more points to redeem this reward.`);
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
            <Text style={styles.headerTitle}>My Rewards</Text>
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
        
        {/* Points Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.pointsCardContainer}>
          <LinearGradient
            colors={['#7B1FA2', '#9C27B0']}
            style={styles.pointsCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.pointsCardContent}>
              <View style={styles.pointsTextContainer}>
                <Text style={styles.pointsLabel}>Your Points Balance</Text>
                <Text style={styles.pointsValue}>{points}</Text>
                <Text style={styles.pointsSubtext}>
                  Earn points with every transaction
                </Text>
              </View>
              <View style={styles.pointsBadgeContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.pointsBadge}>
                  <Ionicons name="star" size={32} color="#FFD700" />
                  <Text style={styles.membershipLevel}>
                    Gold Member
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <View style={styles.pointsCardFooter}>
              <Pressable style={styles.pointsHistoryButton}>
                <Text style={styles.pointsHistoryText}>
                  Points History
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* How to Earn Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.earnSection}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          
          <View style={styles.earnCardsContainer}>
            <View style={styles.earnCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.earnCardGradient}>
                <View style={styles.earnIconContainer}>
                  <Ionicons name="phone-portrait-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.earnTitle}>Buy Airtime</Text>
                <Text style={styles.earnPoints}>+10 points per E10</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.earnCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.earnCardGradient}>
                <View style={styles.earnIconContainer}>
                  <Ionicons name="flash-outline" size={24} color="#FFC107" />
                </View>
                <Text style={styles.earnTitle}>Pay Bills</Text>
                <Text style={styles.earnPoints}>+5 points per E50</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.earnCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.earnCardGradient}>
                <View style={styles.earnIconContainer}>
                  <Ionicons name="people-outline" size={24} color="#2196F3" />
                </View>
                <Text style={styles.earnTitle}>Refer Friends</Text>
                <Text style={styles.earnPoints}>+100 points per referral</Text>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
        
        {/* Available Rewards Section */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(1000)}
          style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          
          <View style={styles.rewardsGrid}>
            {/* Free Airtime Reward */}
            <Pressable 
              style={styles.rewardCard}
              onPress={() => handleRedeemPress('E10 Airtime', 500)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.rewardCardGradient}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name="phone-portrait" size={28} color="#FF9800" />
                </View>
                <Text style={styles.rewardTitle}>E10 Free Airtime</Text>
                <View style={styles.rewardPointsContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rewardPoints}>500 points</Text>
                </View>
                <View style={[styles.redeemButton, points >= 500 ? styles.redeemButtonActive : styles.redeemButtonInactive]}>
                  <Text style={styles.redeemButtonText}>
                    {points >= 500 ? 'Redeem Now' : 'Not Enough Points'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Data Bundle Reward */}
            <Pressable 
              style={styles.rewardCard}
              onPress={() => handleRedeemPress('500MB Data', 800)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.rewardCardGradient}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name="wifi" size={28} color="#2196F3" />
                </View>
                <Text style={styles.rewardTitle}>500MB Data Bundle</Text>
                <View style={styles.rewardPointsContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rewardPoints}>800 points</Text>
                </View>
                <View style={[styles.redeemButton, points >= 800 ? styles.redeemButtonActive : styles.redeemButtonInactive]}>
                  <Text style={styles.redeemButtonText}>
                    {points >= 800 ? 'Redeem Now' : 'Not Enough Points'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Bill Payment Discount */}
            <Pressable 
              style={styles.rewardCard}
              onPress={() => handleRedeemPress('E20 Bill Discount', 1000)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.rewardCardGradient}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name="receipt-outline" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.rewardTitle}>E20 Bill Discount</Text>
                <View style={styles.rewardPointsContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rewardPoints}>1000 points</Text>
                </View>
                <View style={[styles.redeemButton, points >= 1000 ? styles.redeemButtonActive : styles.redeemButtonInactive]}>
                  <Text style={styles.redeemButtonText}>
                    {points >= 1000 ? 'Redeem Now' : 'Not Enough Points'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
            
            {/* Cash Back Reward */}
            <Pressable 
              style={styles.rewardCard}
              onPress={() => handleRedeemPress('E50 Cash Back', 2500)}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.rewardCardGradient}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name="cash-outline" size={28} color="#E91E63" />
                </View>
                <Text style={styles.rewardTitle}>E50 Cash Back</Text>
                <View style={styles.rewardPointsContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rewardPoints}>2500 points</Text>
                </View>
                <View style={[styles.redeemButton, points >= 2500 ? styles.redeemButtonActive : styles.redeemButtonInactive]}>
                  <Text style={styles.redeemButtonText}>
                    {points >= 2500 ? 'Redeem Now' : 'Not Enough Points'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
        
        {/* Membership Tiers Section */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.tiersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membership Tiers</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View Benefits</Text>
            </Pressable>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tiersContainer}>
            
            <View style={styles.tierCard}>
              <LinearGradient
                colors={['rgba(158, 158, 158, 0.3)', 'rgba(158, 158, 158, 0.1)']}
                style={styles.tierCardGradient}>
                <View style={styles.tierIconContainer}>
                  <Ionicons name="star" size={24} color="#9E9E9E" />
                </View>
                <Text style={styles.tierTitle}>Silver</Text>
                <Text style={styles.tierPoints}>0 - 500 points</Text>
                <Text style={styles.tierBenefit}>Basic rewards</Text>
              </LinearGradient>
            </View>
            
            <View style={[styles.tierCard, styles.activeTierCard]}>
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.3)', 'rgba(255, 215, 0, 0.1)']}
                style={styles.tierCardGradient}>
                <View style={styles.tierIconContainer}>
                  <Ionicons name="star" size={24} color="#FFD700" />
                </View>
                <Text style={styles.tierTitle}>Gold</Text>
                <Text style={styles.tierPoints}>501 - 2000 points</Text>
                <Text style={styles.tierBenefit}>2x earning rate</Text>
                <View style={styles.activeLabel}>
                  <Text style={styles.activeLabelText}>Current</Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.tierCard}>
              <LinearGradient
                colors={['rgba(176, 0, 32, 0.3)', 'rgba(176, 0, 32, 0.1)']}
                style={styles.tierCardGradient}>
                <View style={styles.tierIconContainer}>
                  <Ionicons name="star" size={24} color="#B00020" />
                </View>
                <Text style={styles.tierTitle}>Platinum</Text>
                <Text style={styles.tierPoints}>2001+ points</Text>
                <Text style={styles.tierBenefit}>3x earning + VIP perks</Text>
              </LinearGradient>
            </View>
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
  pointsCardContainer: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsCardGradient: {
    borderRadius: 16,
  },
  pointsCardContent: {
    padding: 24,
    flexDirection: 'row',
  },
  pointsTextContainer: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  pointsSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  pointsBadgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  membershipLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  pointsCardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    alignItems: 'flex-end',
  },
  pointsHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsHistoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 4,
  },
  earnSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  earnCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earnCard: {
    width: '31%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  earnCardGradient: {
    padding: 16,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  earnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  earnPoints: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  rewardsSection: {
    padding: 24,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rewardCardGradient: {
    padding: 16,
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
  },
  rewardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardPoints: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  redeemButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  redeemButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  redeemButtonInactive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  tiersSection: {
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
  tiersContainer: {
    paddingRight: 16,
  },
  tierCard: {
    width: 150,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeTierCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
  },
  tierCardGradient: {
    padding: 16,
    height: 140,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tierIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tierPoints: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  tierBenefit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  activeLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
});
