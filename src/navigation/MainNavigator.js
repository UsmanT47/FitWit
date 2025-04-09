import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Temporary Dashboard Screen
const DashboardScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      marginBottom: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
    },
    subTitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    cardText: {
      color: theme.textSecondary,
      marginBottom: 15,
    },
    statContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    stat: {
      alignItems: 'center',
      width: '23%',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.subTitle}>Here's your health summary</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Stats</Text>
        <View style={styles.statContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Water (oz)</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Sleep</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Insights</Text>
        <Text style={styles.cardText}>
          Start logging your health data to receive personalized insights from our AI assistant.
        </Text>
      </View>
    </View>
  );
};

// Temporary Nutrition Screen
const NutritionScreen = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    cardText: {
      color: theme.textSecondary,
      marginBottom: 15,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Tracker</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Nutrition</Text>
        <Text style={styles.cardText}>No meals logged yet today. Start tracking your nutrition by adding meals below.</Text>
        <TouchableOpacity style={styles.button} onPress={() => alert('This feature will be implemented soon!')}>
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Temporary Exercise Screen
const ExerciseScreen = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    cardText: {
      color: theme.textSecondary,
      marginBottom: 15,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Tracker</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Activity</Text>
        <Text style={styles.cardText}>No exercise logged yet today. Start tracking your workouts by adding an activity below.</Text>
        <TouchableOpacity style={styles.button} onPress={() => alert('This feature will be implemented soon!')}>
          <Text style={styles.buttonText}>Log Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Temporary Journal Screen
const JournalScreen = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    cardText: {
      color: theme.textSecondary,
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Journal</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Journal</Text>
        <Text style={styles.cardText}>Track your health metrics to build a comprehensive health journal.</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert('This feature will be implemented soon!')}
          >
            <Text style={styles.buttonText}>Log Mood</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert('This feature will be implemented soon!')}
          >
            <Text style={styles.buttonText}>Log Sleep</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Temporary Profile Screen
const ProfileScreen = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
    },
    avatarText: {
      fontSize: 40,
      color: 'white',
      fontWeight: 'bold',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    email: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 5,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.text,
    },
    logoutButton: {
      backgroundColor: theme.danger,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    logoutButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Theme</Text>
          <TouchableOpacity onPress={toggleTheme}>
            <Text>{isDarkMode ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <TouchableOpacity>
            <Text>On</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.settingLabel}>Units</Text>
          <TouchableOpacity>
            <Text>Metric</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => logout()}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.cardBackground,
          borderTopColor: theme.border,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'ios-restaurant' : 'ios-restaurant-outline';
          } else if (route.name === 'Exercise') {
            iconName = focused ? 'ios-fitness' : 'ios-fitness-outline';
          } else if (route.name === 'Journal') {
            iconName = focused ? 'ios-journal' : 'ios-journal-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Exercise" component={ExerciseScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;