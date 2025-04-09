import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import LogHomeScreen from '../screens/log/LogHomeScreen';

const Stack = createNativeStackNavigator();

/**
 * Log stack navigator
 * Handles all health logging screens (food, water, exercise, sleep, etc.)
 */
const LogNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="LogHome"
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          color: theme.text.primary,
          fontWeight: '600',
          fontSize: 18,
        },
        headerStyle: {
          backgroundColor: theme.background.primary,
        },
        headerTintColor: theme.primary.main,
        contentStyle: { backgroundColor: theme.background.primary },
      }}
    >
      <Stack.Screen
        name="LogHome"
        component={LogHomeScreen}
        options={{
          title: 'Health Log',
          headerLargeTitle: true,
        }}
      />
      
      {/* Placeholder screens until we create them */}
      <Stack.Screen
        name="FoodLog"
        component={LogHomeScreen}
        options={{ title: 'Food Log' }}
      />
      
      <Stack.Screen
        name="WaterLog"
        component={LogHomeScreen}
        options={{ title: 'Water Log' }}
      />
      
      <Stack.Screen
        name="ExerciseLog"
        component={LogHomeScreen}
        options={{ title: 'Exercise Log' }}
      />
      
      <Stack.Screen
        name="SleepLog"
        component={LogHomeScreen}
        options={{ title: 'Sleep Log' }}
      />
      
      <Stack.Screen
        name="MoodLog"
        component={LogHomeScreen}
        options={{ title: 'Mood Log' }}
      />
      
      <Stack.Screen
        name="HealthLog"
        component={LogHomeScreen}
        options={{ title: 'Health Metrics' }}
      />
    </Stack.Navigator>
  );
};

export default LogNavigator;