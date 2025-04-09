import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

/**
 * Authentication stack navigator
 * Handles all authentication-related screens (login, register, forgot password)
 */
const AuthNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={OnboardingScreen} // Placeholder until we create ForgotPasswordScreen
        options={{
          title: 'Forgot Password',
          headerShown: true,
          headerTintColor: theme.text.primary,
          headerStyle: {
            backgroundColor: theme.background.primary,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;