// Using the most basic React Native approach
import React from 'react';
import { Text, View } from 'react-native';

// No external imports, completely self-contained
export default function App() {
  // Simple inline styles, no StyleSheet
  const containerStyle = {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textStyle = {
    fontSize: 24,
    fontWeight: 'bold',
  };

  // Most basic UI possible
  return (
    <View style={containerStyle}>
      <Text style={textStyle}>FitWit Test</Text>
    </View>
  );
}
