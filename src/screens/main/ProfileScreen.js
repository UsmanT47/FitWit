import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { THEMES } from '../../constants/config';

const ProfileScreen = () => {
  const { theme, themeMode, setThemeMode, isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              // Auth context will handle navigation
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };
  
  const toggleDarkMode = () => {
    setThemeMode(isDarkMode ? THEMES.LIGHT : THEMES.DARK);
  };
  
  const setSystemTheme = () => {
    setThemeMode(THEMES.SYSTEM);
  };
  
  const renderSettingItem = ({ icon, title, subtitle, action, toggle, value }) => {
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={action}
        disabled={toggle !== undefined}
      >
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon} size={22} color={theme.primary.main} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text.primary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {toggle !== undefined ? (
          <Switch
            trackColor={{ false: theme.background.tertiary, true: theme.primary.light }}
            thumbColor={value ? theme.primary.main : theme.background.secondary}
            ios_backgroundColor={theme.background.tertiary}
            onValueChange={toggle}
            value={value}
          />
        ) : (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={theme.text.tertiary} 
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Info Section */}
        <View style={[styles.userInfoContainer, { backgroundColor: theme.background.secondary }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary.light }]}>
            <Text style={[styles.avatarText, { color: theme.primary.main }]}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text.primary }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.text.secondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
          <TouchableOpacity
            style={[styles.editProfileButton, { borderColor: theme.primary.main }]}
          >
            <Text style={[styles.editProfileText, { color: theme.primary.main }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Appearance
          </Text>
          
          {renderSettingItem({
            icon: 'moon',
            title: 'Dark Mode',
            subtitle: 'Toggle dark mode on or off',
            toggle: toggleDarkMode,
            value: isDarkMode,
          })}
          
          {renderSettingItem({
            icon: 'phone-portrait',
            title: 'Use System Settings',
            subtitle: 'Follow your device theme',
            toggle: setSystemTheme,
            value: themeMode === THEMES.SYSTEM,
          })}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Data
          </Text>
          
          {renderSettingItem({
            icon: 'fitness',
            title: 'Connect Fitness Tracker',
            subtitle: 'Sync data with your wearable devices',
            action: () => {},
          })}
          
          {renderSettingItem({
            icon: 'cloud-download',
            title: 'Export Health Data',
            subtitle: 'Save your health logs to a file',
            action: () => {},
          })}
          
          {renderSettingItem({
            icon: 'trash',
            title: 'Clear All Data',
            subtitle: 'Delete all your health logs',
            action: () => {},
          })}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Account
          </Text>
          
          {renderSettingItem({
            icon: 'notifications',
            title: 'Notifications',
            subtitle: 'Manage your notification preferences',
            action: () => {},
          })}
          
          {renderSettingItem({
            icon: 'lock-closed',
            title: 'Change Password',
            subtitle: 'Update your account password',
            action: () => {},
          })}
          
          {renderSettingItem({
            icon: 'help-circle',
            title: 'Help & Support',
            subtitle: 'Contact us or view FAQs',
            action: () => {},
          })}
          
          {renderSettingItem({
            icon: 'document-text',
            title: 'Privacy Policy',
            subtitle: 'Read our privacy policy',
            action: () => {},
          })}
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton, 
            { backgroundColor: theme.error.light },
            isLoggingOut && { opacity: 0.7 }
          ]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.error.main} />
          <Text style={[styles.logoutText, { color: theme.error.main }]}>
            {isLoggingOut ? 'Logging Out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.text.tertiary }]}>
            FitWit v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});

export default ProfileScreen;