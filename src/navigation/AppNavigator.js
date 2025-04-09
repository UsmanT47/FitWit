import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Import context
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Import constants
import { STORAGE_KEYS } from '../constants/config';

const Stack = createNativeStackNavigator();

/**
 * Main app navigator
 * Handles switching between auth and main flows based on authentication state
 */
const AppNavigator = () => {
  const { theme } = useTheme();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        setShowOnboarding(hasCompletedOnboarding !== 'true');
        setInitializing(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setInitializing(false);
      }
    };
    
    checkOnboarding();
  }, []);
  
  // Show loading screen while checking auth state and onboarding status
  if (initializing || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background.primary }}>
        <ActivityIndicator size="large" color={theme.primary.main} />
      </View>
    );
  }
  
  return (
    <NavigationContainer theme={{ colors: { background: theme.background.primary } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // User is signed in
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          // User is not signed in
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            initialParams={{ showOnboarding }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;