import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// Create auth stack
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { theme } = useTheme();
  
  // Default screen options for auth stack
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.background.primary,
    },
    headerTintColor: theme.text.primary,
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.background.primary,
    },
  };
  
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;