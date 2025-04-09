import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const LogHomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const logItems = [
    {
      id: 'food',
      title: 'Food',
      icon: 'fast-food-outline',
      color: theme.error.main,
      screen: 'FoodLog',
      description: 'Log your meals and track your nutrition intake',
    },
    {
      id: 'water',
      title: 'Water',
      icon: 'water-outline',
      color: theme.info.main,
      screen: 'WaterLog',
      description: 'Track your daily water consumption',
    },
    {
      id: 'exercise',
      title: 'Exercise',
      icon: 'barbell-outline',
      color: theme.success.main,
      screen: 'ExerciseLog',
      description: 'Record your workouts and physical activities',
    },
    {
      id: 'sleep',
      title: 'Sleep',
      icon: 'moon-outline',
      color: theme.secondary.main,
      screen: 'SleepLog',
      description: 'Track your sleep patterns and quality',
    },
    {
      id: 'mood',
      title: 'Mood',
      icon: 'happy-outline',
      color: theme.warning.main,
      screen: 'MoodLog',
      description: "Record how you're feeling throughout the day",
    },
    {
      id: 'health',
      title: 'Health Metrics',
      icon: 'fitness-outline',
      color: theme.primary.main,
      screen: 'HealthLog',
      description: 'Track vital signs, blood pressure, weight, etc.',
    },
  ];
  
  const handleLogItemPress = (screen) => {
    navigation.navigate(screen);
  };
  
  const renderLogItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.logItem, { backgroundColor: theme.background.secondary }]}
        onPress={() => handleLogItemPress(item.screen)}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.logItemContent}>
          <Text style={[styles.logItemTitle, { color: theme.text.primary }]}>
            {item.title}
          </Text>
          <Text style={[styles.logItemDescription, { color: theme.text.secondary }]}>
            {item.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
            What would you like to log?
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
            Keep track of your daily health activities
          </Text>
        </View>
        
        <View style={styles.logItemsContainer}>
          {logItems.map(renderLogItem)}
        </View>
        
        <View style={styles.additionalOptions}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Additional Options
          </Text>
          
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="scan-outline" size={24} color={theme.primary.main} />
              <Text style={[styles.optionButtonText, { color: theme.text.primary }]}>
                Scan Barcode
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="mic-outline" size={24} color={theme.primary.main} />
              <Text style={[styles.optionButtonText, { color: theme.text.primary }]}>
                Voice Input
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.reminderContainer}>
          <View style={[styles.reminderCard, { backgroundColor: theme.background.highlight }]}>
            <Ionicons name="time-outline" size={24} color={theme.primary.main} />
            <View style={styles.reminderContent}>
              <Text style={[styles.reminderTitle, { color: theme.text.primary }]}>
                Set Reminders
              </Text>
              <Text style={[styles.reminderDescription, { color: theme.text.secondary }]}>
                Don't forget to log your health data regularly
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.reminderButton, { backgroundColor: theme.primary.main }]}
            >
              <Text style={styles.reminderButtonText}>Set Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  logItemsContainer: {
    marginBottom: 24,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logItemContent: {
    flex: 1,
  },
  logItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  logItemDescription: {
    fontSize: 14,
  },
  additionalOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  optionButtonText: {
    fontSize: 14,
    marginTop: 8,
  },
  reminderContainer: {
    marginBottom: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  reminderContent: {
    flex: 1,
    marginLeft: 16,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
  },
  reminderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reminderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LogHomeScreen;