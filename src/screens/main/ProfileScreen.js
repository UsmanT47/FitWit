import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../../constants/config';
import { getProfileStats, getUserPreferences, updateUserPreferences, clearAllData } from '../../services/storageService';

const ProfileScreen = () => {
  const { theme, themeMode, setThemeMode, isDarkMode } = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    streakDays: 0,
    totalLogs: 0,
    completionRate: 0,
    averageSleep: 0,
    avgWaterIntake: 0,
  });
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    reminders: true,
    useMetric: false,
    waterGoal: 8,
    sleepGoal: 8,
  });
  
  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);
  
  // Load profile stats and preferences
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Get user stats
      const userStats = await getProfileStats();
      setStats(userStats);
      
      // Get user preferences
      const userPrefs = await getUserPreferences();
      if (userPrefs && Object.keys(userPrefs).length > 0) {
        setPreferences(prevPrefs => ({
          ...prevPrefs,
          ...userPrefs,
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle theme mode
  const toggleTheme = () => {
    setThemeMode(isDarkMode ? THEMES.LIGHT : THEMES.DARK);
  };
  
  // Toggle notification preference
  const toggleNotifications = async (value) => {
    try {
      const updatedPrefs = { ...preferences, notifications: value };
      setPreferences(updatedPrefs);
      await updateUserPreferences(updatedPrefs);
    } catch (error) {
      console.error('Error updating notification preference:', error);
    }
  };
  
  // Toggle reminders preference
  const toggleReminders = async (value) => {
    try {
      const updatedPrefs = { ...preferences, reminders: value };
      setPreferences(updatedPrefs);
      await updateUserPreferences(updatedPrefs);
    } catch (error) {
      console.error('Error updating reminders preference:', error);
    }
  };
  
  // Toggle unit system preference
  const toggleUnitSystem = async (value) => {
    try {
      const updatedPrefs = { ...preferences, useMetric: value };
      setPreferences(updatedPrefs);
      await updateUserPreferences(updatedPrefs);
    } catch (error) {
      console.error('Error updating unit system preference:', error);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };
  
  // Handle reset data
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await clearAllData();
              // Reload stats after clearing data
              await loadProfileData();
              Alert.alert('Success', 'All data has been reset successfully');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data');
            }
          }
        },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.primary.main }]}>
          <Text style={[styles.avatarText, { color: theme.primary.contrast }]}>
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.username, { color: theme.text.primary }]}>
          {user?.username || 'User'}
        </Text>
        <Text style={[styles.email, { color: theme.text.secondary }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
      
      {/* Stats Section */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Your Stats
      </Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary.main} />
        </View>
      ) : (
        <View style={[styles.statsContainer, { backgroundColor: theme.background.secondary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {stats.streakDays}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Day Streak
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {stats.totalLogs}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Total Logs
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {stats.completionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Completion
            </Text>
          </View>
        </View>
      )}
      
      {/* Preferences Section */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Preferences
      </Text>
      <View style={[styles.preferencesContainer, { backgroundColor: theme.background.secondary }]}>
        {/* Dark Mode Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceTextContainer}>
            <Ionicons 
              name={isDarkMode ? 'moon' : 'sunny'} 
              size={20} 
              color={theme.text.primary} 
            />
            <Text style={[styles.preferenceText, { color: theme.text.primary }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.text.tertiary, true: theme.primary.light }}
            thumbColor={isDarkMode ? theme.primary.main : theme.background.primary}
          />
        </View>
        
        {/* Notifications Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceTextContainer}>
            <Ionicons 
              name="notifications" 
              size={20} 
              color={theme.text.primary} 
            />
            <Text style={[styles.preferenceText, { color: theme.text.primary }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={preferences.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: theme.text.tertiary, true: theme.primary.light }}
            thumbColor={preferences.notifications ? theme.primary.main : theme.background.primary}
          />
        </View>
        
        {/* Reminders Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceTextContainer}>
            <Ionicons 
              name="alarm" 
              size={20} 
              color={theme.text.primary} 
            />
            <Text style={[styles.preferenceText, { color: theme.text.primary }]}>
              Daily Reminders
            </Text>
          </View>
          <Switch
            value={preferences.reminders}
            onValueChange={toggleReminders}
            trackColor={{ false: theme.text.tertiary, true: theme.primary.light }}
            thumbColor={preferences.reminders ? theme.primary.main : theme.background.primary}
          />
        </View>
        
        {/* Units Toggle */}
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceTextContainer}>
            <Ionicons 
              name="options" 
              size={20} 
              color={theme.text.primary} 
            />
            <Text style={[styles.preferenceText, { color: theme.text.primary }]}>
              Use Metric Units
            </Text>
          </View>
          <Switch
            value={preferences.useMetric}
            onValueChange={toggleUnitSystem}
            trackColor={{ false: theme.text.tertiary, true: theme.primary.light }}
            thumbColor={preferences.useMetric ? theme.primary.main : theme.background.primary}
          />
        </View>
      </View>
      
      {/* Account Section */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Account
      </Text>
      <View style={[styles.accountContainer, { backgroundColor: theme.background.secondary }]}>
        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountItemContent}>
            <Ionicons name="person" size={20} color={theme.text.primary} />
            <Text style={[styles.accountItemText, { color: theme.text.primary }]}>
              Edit Profile
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountItem}>
          <View style={styles.accountItemContent}>
            <Ionicons name="lock-closed" size={20} color={theme.text.primary} />
            <Text style={[styles.accountItemText, { color: theme.text.primary }]}>
              Change Password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accountItem}
          onPress={handleResetData}
        >
          <View style={styles.accountItemContent}>
            <Ionicons name="trash" size={20} color={theme.error.main} />
            <Text style={[styles.accountItemText, { color: theme.error.main }]}>
              Reset All Data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accountItem}
          onPress={handleLogout}
        >
          <View style={styles.accountItemContent}>
            <Ionicons name="log-out" size={20} color={theme.error.main} />
            <Text style={[styles.accountItemText, { color: theme.error.main }]}>
              Logout
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
        </TouchableOpacity>
      </View>
      
      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={[styles.appVersion, { color: theme.text.tertiary }]}>
          FitWit v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  avatarText: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: 'bold',
  },
  username: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.TINY,
  },
  email: {
    fontSize: FONT_SIZES.MEDIUM,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  loadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
    padding: SPACING.MEDIUM,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.TINY,
  },
  statLabel: {
    fontSize: FONT_SIZES.SMALL,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
  },
  preferencesContainer: {
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  preferenceTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginLeft: SPACING.MEDIUM,
  },
  accountContainer: {
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accountItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountItemText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginLeft: SPACING.MEDIUM,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  appVersion: {
    fontSize: FONT_SIZES.SMALL,
  },
});

export default ProfileScreen;