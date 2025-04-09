import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

/**
 * Main app navigator
 * Handles switching between auth and main flows based on authentication state
 */
const AppNavigator = () => {
  const { theme, isLoading: themeLoading } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Wait for both theme and auth to load before rendering
  useEffect(() => {
    if (!themeLoading && !authLoading) {
      setIsReady(true);
    }
  }, [themeLoading, authLoading]);
  
  // Show loading indicator while loading theme and auth
  if (!isReady) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary.main} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;