import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InsightsScreen from '../screens/insights/InsightsScreen';
import FoodLogScreen from '../screens/logs/FoodLogScreen';
import MoodLogScreen from '../screens/logs/MoodLogScreen';
import ExerciseLogScreen from '../screens/logs/ExerciseLogScreen';
import SleepLogScreen from '../screens/logs/SleepLogScreen';
import WaterLogScreen from '../screens/logs/WaterLogScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Log Navigator - contains all logging screens
const LogNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="FoodLog" component={FoodLogScreen} />
      <Stack.Screen name="MoodLog" component={MoodLogScreen} />
      <Stack.Screen name="ExerciseLog" component={ExerciseLogScreen} />
      <Stack.Screen name="SleepLog" component={SleepLogScreen} />
      <Stack.Screen name="WaterLog" component={WaterLogScreen} />
    </Stack.Navigator>
  );
};

// Profile Navigator - contains profile and settings
const ProfileNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

// Main Navigator - bottom tabs
const MainNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Log') {
            iconName = 'plus-square';
          } else if (route.name === 'Insights') {
            iconName = 'bar-chart-2';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.cardBackground,
          borderTopColor: theme.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Log" component={LogNavigator} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
