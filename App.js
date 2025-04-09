import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Simple test app to verify configuration
export default function App() {
  console.log('App is starting...');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <StatusBar style="auto" />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>FitWit Health App</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', paddingHorizontal: 20 }}>
        Welcome to FitWit! This is a simplified version to test if the app loads correctly.
      </Text>
    </View>
  );
}
