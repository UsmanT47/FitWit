import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const CustomButton = ({ 
  title, 
  onPress, 
  type = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
  icon = null,
  accessibilityLabel
}) => {
  const { theme } = useTheme();
  
  // Determine button styles based on type and theme
  const getButtonStyles = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: theme.buttonSecondaryBackground,
          borderColor: theme.buttonSecondaryBorder,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
        };
      case 'danger':
        return {
          backgroundColor: theme.danger,
          borderWidth: 0,
        };
      default: // primary
        return {
          backgroundColor: theme.primary,
          borderWidth: 0,
        };
    }
  };
  
  // Determine text styles based on button type
  const getTextStyles = () => {
    switch (type) {
      case 'secondary':
        return { color: theme.buttonSecondaryText };
      case 'outline':
        return { color: theme.primary };
      case 'text':
        return { color: theme.primary };
      case 'danger':
        return { color: '#fff' };
      default: // primary
        return { color: '#fff' };
    }
  };
  
  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          fontSize: FONT_SIZES.sm,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          fontSize: FONT_SIZES.lg,
        };
      default: // medium
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          fontSize: FONT_SIZES.md,
        };
    }
  };
  
  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();
  const sizeStyles = getSizeStyles();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        buttonStyles,
        { paddingVertical: sizeStyles.paddingVertical, 
          paddingHorizontal: sizeStyles.paddingHorizontal },
        disabled && styles.disabledButton,
        style
      ]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={textStyles.color}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              textStyles,
              { fontSize: sizeStyles.fontSize },
              icon && { marginLeft: 8 },
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 80,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton;
