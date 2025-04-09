import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import CustomButton from '../../components/CustomButton';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { getProfileStats } from '../../services/storageService';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme, themeMode, setTheme, isDarkMode } = useTheme();
  
  const [userStats, setUserStats] = useState({
    daysActive: 0,
    logsCount: 0,
    streak: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user stats on mount
  useEffect(() => {
    loadUserStats();
  }, []);
  
  const loadUserStats = async () => {
    try {
      const stats = await getProfileStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading profile stats:', error);
    }
  };
  
  // Navigate to settings
  const goToSettings = () => {
    navigation.navigate('Settings');
  };
  
  // Handle user logout
  const handleLogout = async () => {
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
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Toggle theme mode
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Profile" 
        rightComponent={
          <TouchableOpacity
            onPress={goToSettings}
            accessibilityLabel="Settings"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="settings" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View 
            style={[
              styles.avatarContainer, 
              { backgroundColor: theme.primary }
            ]}
          >
            <Text style={styles.avatarText}>
              {getUserInitials()}
            </Text>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.name || 'User'}
          </Text>
          
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || 'email@example.com'}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View 
            style={[
              styles.statCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>
              {userStats.daysActive}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Days Active
            </Text>
          </View>
          
          <View 
            style={[
              styles.statCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>
              {userStats.logsCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Logs
            </Text>
          </View>
          
          <View 
            style={[
              styles.statCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Text style={[styles.statValue, { color: theme.text }]}>
              {userStats.streak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Day Streak
            </Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Settings
          </Text>
          
          <TouchableOpacity
            style={[
              styles.settingItem,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle dark mode"
            accessibilityRole="switch"
            accessibilityState={{ checked: isDarkMode }}
          >
            <View style={styles.settingItemLeft}>
              <Feather 
                name={isDarkMode ? 'moon' : 'sun'} 
                size={22} 
                color={theme.text} 
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Feather 
              name="chevron-right" 
              size={22} 
              color={theme.textTertiary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingItem,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            onPress={goToSettings}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <View style={styles.settingItemLeft}>
              <Feather 
                name="settings" 
                size={22} 
                color={theme.text} 
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Settings
              </Text>
            </View>
            <Feather 
              name="chevron-right" 
              size={22} 
              color={theme.textTertiary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingItem,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.settingItemLeft}>
              <Feather 
                name="bell" 
                size={22} 
                color={theme.text} 
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Notifications
              </Text>
            </View>
            <Feather 
              name="chevron-right" 
              size={22} 
              color={theme.textTertiary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.textTertiary }]}>
            FitWit v1.0.0
          </Text>
        </View>
        
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          type="outline"
          loading={isLoading}
          disabled={isLoading}
          style={styles.logoutButton}
          accessibilityLabel="Logout"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.lg,
  },
  statCard: {
    width: '31%',
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: SPACING.sm,
  },
  settingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  appVersion: {
    fontSize: FONT_SIZES.sm,
  },
  logoutButton: {
    marginTop: SPACING.md,
  },
});

export default ProfileScreen;
