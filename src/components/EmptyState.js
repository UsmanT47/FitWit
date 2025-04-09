import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';
import CustomButton from './CustomButton';

const EmptyState = ({
  icon = 'inbox',
  title = 'No data available',
  message = 'There is no data to display at this time.',
  buttonTitle = '',
  onButtonPress,
  style = {}
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <Feather 
        name={icon} 
        size={64} 
        color={theme.textSecondary} 
        style={styles.icon}
      />
      
      <Text 
        style={[styles.title, { color: theme.text }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      
      <Text 
        style={[styles.message, { color: theme.textSecondary }]}
        accessibilityRole="text"
      >
        {message}
      </Text>
      
      {buttonTitle && onButtonPress && (
        <CustomButton
          title={buttonTitle}
          onPress={onButtonPress}
          type="primary"
          style={styles.button}
          accessibilityLabel={buttonTitle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;
