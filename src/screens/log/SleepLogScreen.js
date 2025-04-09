import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';

const SleepLogScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <Text style={[styles.text, { color: theme.text.primary }]}>
        Sleep Log Screen
      </Text>
      <Text style={[styles.subtext, { color: theme.text.secondary }]}>
        This screen will be implemented to track sleep patterns
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
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  subtext: {
    fontSize: FONT_SIZES.MEDIUM,
    textAlign: 'center',
  },
});

export default SleepLogScreen;