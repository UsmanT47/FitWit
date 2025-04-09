import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';

const LoadingScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ActivityIndicator size="large" color={theme.primary.main} />
      <Text style={[styles.text, { color: theme.text.primary }]}>
        Loading...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  text: {
    fontSize: FONT_SIZES.MEDIUM,
    marginTop: SPACING.MEDIUM,
  },
});

export default LoadingScreen;