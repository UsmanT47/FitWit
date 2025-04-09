import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { theme } = useTheme();
  
  // Common screen options
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.headerBackground,
    },
    headerTintColor: theme.text,
    headerTitleStyle: {
      fontWeight: '600',
    },
    contentStyle: {
      backgroundColor: theme.background,
    },
  };
  
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ 
          title: 'Create Account',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
