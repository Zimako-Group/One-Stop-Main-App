import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Switch, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  
  // User data
  const [userData, setUserData] = useState({
    name: 'Obakeng Jele',
    email: 'obakeng.jele@example.com',
    phone: '+268 7612 3456',
    address: 'Mbabane, Eswatini'
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => router.replace('/(auth)')
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    // Here you would typically save the data to a backend
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

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
        <Text style={styles.headerTitle}>My Profile</Text>
        {!editMode ? (
          <Pressable 
            style={styles.editButton}
            onPress={() => setEditMode(true)}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </Pressable>
        ) : (
          <Pressable 
            style={styles.editButton}
            onPress={handleSaveProfile}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </Pressable>
        )}
      </Animated.View>

      {/* Profile Card */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(1000)}
        style={styles.profileCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          style={styles.profileCardGradient}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.avatar}
              />
              {editMode && (
                <Pressable style={styles.changeAvatarButton}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </Pressable>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              {!editMode ? (
                <>
                  <Text style={styles.profileName}>{userData.name}</Text>
                  <Text style={styles.profileEmail}>{userData.email}</Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                    <Text style={styles.verifiedText}>Verified Account</Text>
                  </View>
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    value={userData.name}
                    onChangeText={(text) => setUserData({...userData, name: text})}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                  <TextInput
                    style={styles.input}
                    value={userData.email}
                    onChangeText={(text) => setUserData({...userData, email: text})}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>E350</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Personal Information Section */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.sectionContent}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="call-outline" size={20} color="#1a237e" />
            </View>
            {!editMode ? (
              <Text style={styles.infoText}>{userData.phone}</Text>
            ) : (
              <TextInput
                style={styles.infoInput}
                value={userData.phone}
                onChangeText={(text) => setUserData({...userData, phone: text})}
                placeholder="Phone Number"
                placeholderTextColor="rgba(0,0,0,0.5)"
                keyboardType="phone-pad"
              />
            )}
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="location-outline" size={20} color="#1a237e" />
            </View>
            {!editMode ? (
              <Text style={styles.infoText}>{userData.address}</Text>
            ) : (
              <TextInput
                style={styles.infoInput}
                value={userData.address}
                onChangeText={(text) => setUserData({...userData, address: text})}
                placeholder="Address"
                placeholderTextColor="rgba(0,0,0,0.5)"
              />
            )}
          </View>
        </View>
      </Animated.View>

      {/* Settings Section */}
      <Animated.View 
        entering={FadeInDown.delay(500).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.sectionContent}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="notifications-outline" size={20} color="#2196F3" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#1a237e' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="finger-print-outline" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.settingText}>Biometric Authentication</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#767577', true: '#1a237e' }}
              thumbColor={biometricsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="moon-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#767577', true: '#1a237e' }}
              thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </Animated.View>

      {/* Actions Section */}
      <Animated.View 
        entering={FadeInDown.delay(600).duration(1000)}
        style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionContent}>
          <Pressable style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Security Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
          
          <Pressable style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(0, 150, 136, 0.1)' }]}>
                <Ionicons name="card-outline" size={20} color="#009688" />
              </View>
              <Text style={styles.actionText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
          
          <Pressable style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
          
          <Pressable 
            style={[styles.actionItem, styles.logoutItem]}
            onPress={handleLogout}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color="#F44336" />
              </View>
              <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  gradient: {
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  profileCardGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a237e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  input: {
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
    paddingVertical: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 35, 126, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#F44336',
  },
});