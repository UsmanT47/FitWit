import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Import log screens
import LogHomeScreen from '../screens/log/LogHomeScreen';
import FoodLogScreen from '../screens/log/FoodLogScreen';
import WaterLogScreen from '../screens/log/WaterLogScreen';
import MoodLogScreen from '../screens/log/MoodLogScreen';

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
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: theme.background.primary,
        },
        headerTitleStyle: {
          color: theme.text.primary,
        },
        headerTintColor: theme.primary.main,
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
      
      <Stack.Screen 
        name="FoodLog" 
        component={FoodLogScreen} 
        options={{ 
          title: 'Food Log',
        }}
      />
      
      <Stack.Screen 
        name="WaterLog" 
        component={WaterLogScreen} 
        options={{ 
          title: 'Water Log',
        }}
      />
      
      <Stack.Screen 
        name="MoodLog" 
        component={MoodLogScreen} 
        options={{ 
          title: 'Mood Log',
        }}
      />
      
      {/* Additional log screens will be added here as they are developed */}
      {/* 
      <Stack.Screen 
        name="ExerciseLog" 
        component={ExerciseLogScreen} 
        options={{ title: 'Exercise Log' }}
      />
      
      <Stack.Screen 
        name="SleepLog" 
        component={SleepLogScreen} 
        options={{ title: 'Sleep Log' }}
      />
      
      <Stack.Screen 
        name="HealthLog" 
        component={HealthLogScreen} 
        options={{ title: 'Health Metrics' }}
      />
      
      <Stack.Screen 
        name="ScanBarcode" 
        component={BarcodeScannerScreen} 
        options={{ title: 'Scan Food Barcode' }}
      />
      
      <Stack.Screen 
        name="VoiceInput" 
        component={VoiceInputScreen} 
        options={{ title: 'Voice Input' }}
      />
      */}
    </Stack.Navigator>
  );
};

export default LogNavigator;