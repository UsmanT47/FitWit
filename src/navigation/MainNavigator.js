import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Import main screens
import DashboardScreen from '../screens/main/DashboardScreen';
import InsightsScreen from '../screens/main/InsightsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Import log screens
import LogNavigator from './LogNavigator';

// Create the main navigation stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for the main app screens
const TabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Log') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary.main,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.background.primary,
          borderTopColor: theme.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.background.primary,
        },
        headerTintColor: theme.text.primary,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Log" 
        component={LogNavigator} 
        options={{
          title: 'Log',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          title: 'Insights',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background.primary,
        },
        headerTintColor: theme.text.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.background.primary,
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;