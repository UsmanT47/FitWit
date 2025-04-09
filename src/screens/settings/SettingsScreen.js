import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import ReminderItem from '../../components/ReminderItem';
import CustomButton from '../../components/CustomButton';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { 
  getUserPreferences, 
  updateUserPreferences,
  getReminders,
  updateReminder,
  deleteReminder,
  clearAllData
} from '../../services/storageService';
import { 
  requestNotificationPermissions, 
  cancelAllNotifications 
} from '../../services/notificationService';

const SettingsScreen = ({ navigation }) => {
  const { theme, themeMode, setTheme } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Preferences state
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user preferences on mount
  useEffect(() => {
    loadUserPreferences();
    loadReminders();
  }, []);
  
  // Load user preferences
  const loadUserPreferences = async () => {
    try {
      const prefs = await getUserPreferences();
      if (prefs) {
        setNotifications(prefs.notifications !== false);
        setPrivacyMode(prefs.privacyMode === true);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };
  
  // Load reminders
  const loadReminders = async () => {
    try {
      const userReminders = await getReminders();
      setReminders(userReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };
  
  // Handle notification toggle
  const handleNotificationToggle = async (value) => {
    setNotifications(value);
    
    if (value) {
      // Request permissions when enabling
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications in your device settings to receive reminders.',
          [{ text: 'OK' }]
        );
        setNotifications(false);
        return;
      }
    } else {
      // Cancel all notifications when disabling
      await cancelAllNotifications();
    }
    
    // Save preference
    await updateUserPreferences({ notifications: value });
  };
  
  // Handle privacy mode toggle
  const handlePrivacyModeToggle = async (value) => {
    setPrivacyMode(value);
    await updateUserPreferences({ privacyMode: value });
  };
  
  // Handle reminder toggle
  const handleReminderToggle = async (id, enabled) => {
    try {
      await updateReminder(id, { enabled });
      setReminders(reminders.map(reminder => 
        reminder.id === id ? { ...reminder, enabled } : reminder
      ));
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };
  
  // Handle reminder time change
  const handleReminderTimeChange = async (id, time) => {
    try {
      await updateReminder(id, { time });
      setReminders(reminders.map(reminder => 
        reminder.id === id ? { ...reminder, time } : reminder
      ));
    } catch (error) {
      console.error('Error updating reminder time:', error);
    }
  };
  
  // Handle reminder delete
  const handleReminderDelete = async (id) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };
  
  // Handle clear all data
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your health data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          onPress: async () => {
            setIsLoading(true);
            try {
              await clearAllData();
              Alert.alert('Success', 'All health data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Theme selector options
  const themeOptions = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System Default', icon: 'smartphone' }
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Settings" 
        showBackButton={true}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            App Preferences
          </Text>
          
          <View 
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="bell" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: theme.switchTrackOff, true: theme.switchTrackOn }}
              thumbColor={theme.switchThumb}
              ios_backgroundColor={theme.switchTrackOff}
              accessibilityLabel="Toggle notifications"
              accessibilityRole="switch"
              accessibilityState={{ checked: notifications }}
            />
          </View>
          
          <View 
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="lock" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Privacy Mode
              </Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={handlePrivacyModeToggle}
              trackColor={{ false: theme.switchTrackOff, true: theme.switchTrackOn }}
              thumbColor={theme.switchThumb}
              ios_backgroundColor={theme.switchTrackOff}
              accessibilityLabel="Toggle privacy mode"
              accessibilityRole="switch"
              accessibilityState={{ checked: privacyMode }}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          
          <View 
            style={[
              styles.themeContainer,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
          >
            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  themeMode === option.value && { 
                    backgroundColor: `${theme.primary}20`,
                    borderColor: theme.primary
                  }
                ]}
                onPress={() => setTheme(option.value)}
                accessibilityLabel={`Set ${option.label} theme`}
                accessibilityRole="radio"
                accessibilityState={{ checked: themeMode === option.value }}
              >
                <Feather 
                  name={option.icon} 
                  size={20} 
                  color={themeMode === option.value ? theme.primary : theme.text} 
                  style={styles.themeIcon}
                />
                <Text 
                  style={[
                    styles.themeLabel, 
                    { 
                      color: themeMode === option.value ? theme.primary : theme.text,
                      fontWeight: themeMode === option.value ? '600' : '400'
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Reminders
          </Text>
          
          {reminders.length > 0 ? (
            <View>
              {reminders.map(reminder => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={handleReminderToggle}
                  onTimeChange={handleReminderTimeChange}
                  onDelete={handleReminderDelete}
                />
              ))}
            </View>
          ) : (
            <View 
              style={[
                styles.emptyReminders,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border
                }
              ]}
            >
              <Feather name="clock" size={24} color={theme.textSecondary} />
              <Text style={[styles.emptyRemindersText, { color: theme.text }]}>
                No reminders set
              </Text>
              <Text style={[styles.emptyRemindersSubtext, { color: theme.textSecondary }]}>
                Add reminders from the logging screens
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Data Management
          </Text>
          
          <TouchableOpacity
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            accessibilityLabel="Export health data"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="download" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Export Health Data
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            onPress={handleClearData}
            accessibilityLabel="Clear all data"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="trash-2" size={20} color={theme.danger} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.danger }]}>
                Clear All Data
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          
          <TouchableOpacity
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            accessibilityLabel="Privacy policy"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="shield" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            accessibilityLabel="Terms of service"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="file-text" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Terms of Service
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.settingRow,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
            accessibilityLabel="Help and support"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Feather name="help-circle" size={20} color={theme.primary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.textTertiary }]}>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: SPACING.sm,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  themeContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  themeIcon: {
    marginRight: SPACING.sm,
  },
  themeLabel: {
    fontSize: FONT_SIZES.md,
  },
  emptyReminders: {
    padding: SPACING.lg,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyRemindersText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  emptyRemindersSubtext: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  versionText: {
    fontSize: FONT_SIZES.sm,
  },
});

export default SettingsScreen;
