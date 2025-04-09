import { Dimensions, Platform, StatusBar } from 'react-native';

// Device dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

// Spacing
export const SPACING = {
  TINY: 4,
  XSMALL: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
};

// Border radius
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
  XXLARGE: 24,
  ROUND: 9999,
};

// Font sizes
export const FONT_SIZES = {
  TINY: 10,
  XSMALL: 12,
  SMALL: 14,
  MEDIUM: 16,
  LARGE: 18,
  XLARGE: 20,
  XXLARGE: 24,
  XXXLARGE: 30,
  DISPLAY: 36,
};

// Icon sizes
export const ICON_SIZES = {
  TINY: 12,
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32,
  XLARGE: 48,
};

// Shadows
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Header heights
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
export const HEADER_HEIGHT_EXPANDED = Platform.OS === 'ios' ? 128 : 104;

// Bottom tab
export const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 83 : 64; // Includes safe area on iOS

// Input heights
export const INPUT_HEIGHT = 48;
export const INPUT_HEIGHT_SMALL = 36;

// Avatar sizes
export const AVATAR_SIZES = {
  TINY: 24,
  SMALL: 32,
  MEDIUM: 48,
  LARGE: 64,
  XLARGE: 96,
};

// Card dimensions
export const CARD = {
  BORDER_RADIUS: 12,
  PADDING: SPACING.MEDIUM,
  MARGIN: SPACING.SMALL,
  SHADOW: SHADOWS.SMALL,
};

// Helper for responsive sizing
export const dynamicSize = (size) => {
  const baseWidth = 375; // Base width (iPhone X)
  const scaleFactor = SCREEN_WIDTH / baseWidth;
  
  // Limit the scaling to prevent too small/large sizes
  if (scaleFactor < 0.8) {
    return size * 0.8;
  } else if (scaleFactor > 1.2) {
    return size * 1.2;
  }
  
  return size * scaleFactor;
};