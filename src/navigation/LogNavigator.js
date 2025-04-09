import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Import log screens
import LogHomeScreen from '../screens/log/LogHomeScreen';
import FoodLogScreen from '../screens/log/FoodLogScreen';
import ExerciseLogScreen from '../screens/log/ExerciseLogScreen';
import SleepLogScreen from '../screens/log/SleepLogScreen';
import MoodLogScreen from '../screens/log/MoodLogScreen';
import WaterLogScreen from '../screens/log/WaterLogScreen';
import HealthLogScreen from '../screens/log/HealthLogScreen';
import ScanBarcodeScreen from '../screens/log/ScanBarcodeScreen';
import VoiceInputScreen from '../screens/log/VoiceInputScreen';

// Create log stack
const Stack = createNativeStackNavigator();

const LogNavigator = () => {
  const { theme } = useTheme();
  
  // Default screen options for log stack
  const screenOptions = {
    headerStyle: {
      backgroundColor: theme.background.primary,
    },
    headerTintColor: theme.text.primary,
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.background.primary,
    },
    animation: 'slide_from_right',
  };
  
  return (
    <Stack.Navigator 
      initialRouteName="LogHome"
      screenOptions={screenOptions}
    >
      <Stack.Screen 
        name="LogHome" 
        component={LogHomeScreen} 
        options={{ title: 'Log Data' }}
      />
      <Stack.Screen 
        name="FoodLog" 
        component={FoodLogScreen} 
        options={{ title: 'Log Food' }}
      />
      <Stack.Screen 
        name="ExerciseLog" 
        component={ExerciseLogScreen} 
        options={{ title: 'Log Exercise' }}
      />
      <Stack.Screen 
        name="SleepLog" 
        component={SleepLogScreen} 
        options={{ title: 'Log Sleep' }}
      />
      <Stack.Screen 
        name="MoodLog" 
        component={MoodLogScreen} 
        options={{ title: 'Log Mood' }}
      />
      <Stack.Screen 
        name="WaterLog" 
        component={WaterLogScreen} 
        options={{ title: 'Log Water' }}
      />
      <Stack.Screen 
        name="HealthLog" 
        component={HealthLogScreen} 
        options={{ title: 'Log Health Metrics' }}
      />
      <Stack.Screen 
        name="ScanBarcode" 
        component={ScanBarcodeScreen} 
        options={{ 
          title: 'Scan Food Barcode',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="VoiceInput" 
        component={VoiceInputScreen} 
        options={{ 
          title: 'Voice Input',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default LogNavigator;