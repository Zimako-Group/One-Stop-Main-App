import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function Settings() {
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [savePaymentInfo, setSavePaymentInfo] = useState(true);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          onPress: () => Alert.alert('Success', 'App data cleared successfully'),
          style: 'destructive'
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          onPress: () => {
            setNotificationsEnabled(true);
            setBiometricsEnabled(false);
            setDarkModeEnabled(false);
            setSavePaymentInfo(true);
            setAutoTopUp(false);
            setShowBalance(true);
            Alert.alert('Success', 'Settings reset to default');
          }
        }
      ]
    );
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
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </Animated.View>

      {/* Settings Sections */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(1000)}
        style={styles.settingsContainer}>
        
        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={biometricsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Payment Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Payment Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="card-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Save Payment Information</Text>
            </View>
            <Switch
              value={savePaymentInfo}
              onValueChange={setSavePaymentInfo}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={savePaymentInfo ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="repeat-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Auto Top-Up</Text>
            </View>
            <Switch
              value={autoTopUp}
              onValueChange={setAutoTopUp}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={autoTopUp ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="eye-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Show Balance on Home</Text>
            </View>
            <Switch
              value={showBalance}
              onValueChange={setShowBalance}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor={showBalance ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* App Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <Pressable 
            style={styles.actionItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.actionValue}>
              <Text style={styles.actionValueText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </View>
          </Pressable>
          
          <Pressable 
            style={styles.actionItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </Pressable>
          
          <Pressable 
            style={styles.actionItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={24} color="#1a237e" />
              <Text style={styles.settingLabel}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </Pressable>
        </View>
        
        {/* Danger Zone */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <Pressable 
            style={styles.dangerItem}
            onPress={handleResetSettings}>
            <View style={styles.settingInfo}>
              <Ionicons name="refresh-outline" size={24} color="#ff9800" />
              <Text style={styles.settingLabel}>Reset Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </Pressable>
          
          <Pressable 
            style={styles.dangerItem}
            onPress={handleClearData}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={24} color="#dc3545" />
              <Text style={styles.settingLabel}>Clear App Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </Pressable>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  gradient: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsContainer: {
    paddingHorizontal: 24,
  },
  settingsSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  actionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionValueText: {
    fontSize: 14,
    color: '#777',
    marginRight: 8,
  },
  versionText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    fontSize: 14,
  }
});
