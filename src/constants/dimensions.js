import { Dimensions, Platform } from 'react-native';

// Get screen dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

// Border radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Platform specific dimensions
export const PLATFORM = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  HEADER_HEIGHT: Platform.OS === 'ios' ? 44 : 56,
  STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 20 : 0,
  BOTTOM_TAB_HEIGHT: Platform.OS === 'ios' ? 49 : 56,
  ANDROID_RIPPLE: { color: 'rgba(0, 0, 0, 0.1)', borderless: false },
};

// Device size detection
export const DEVICE_SIZE = {
  IS_SMALL: SCREEN_HEIGHT < 600,
  IS_MEDIUM: SCREEN_HEIGHT >= 600 && SCREEN_HEIGHT < 800,
  IS_LARGE: SCREEN_HEIGHT >= 800,
};

// Common layout values
export const LAYOUT = {
  container: {
    padding: SPACING.md,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  page: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  PLATFORM,
  DEVICE_SIZE,
  LAYOUT,
};
