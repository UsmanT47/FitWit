import { Dimensions, Platform } from 'react-native';

// Device screen dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

// Spacing values for consistent layout
export const SPACING = {
  TINY: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 48,
};

// Border radius values for consistent styling
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 16,
  XLARGE: 24,
  ROUND: 9999, // Use for circular elements
};

// Font sizes for consistent typography
export const FONT_SIZES = {
  TINY: 10,
  SMALL: 12,
  MEDIUM: 14,
  REGULAR: 16,
  LARGE: 18,
  XLARGE: 20,
  XXLARGE: 24,
  HEADING: 28,
  TITLE: 32,
};

// Icon sizes for consistent styling
export const ICON_SIZES = {
  TINY: 12,
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32,
  XLARGE: 48,
};

// Shadow styles for elevation
export const SHADOWS = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
  },
  STRONG: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 6,
  },
};

// Header heights
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
export const HEADER_HEIGHT_EXPANDED = Platform.OS === 'ios' ? 128 : 104;

// Bottom tabs height
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
  WIDTH: SCREEN_WIDTH - (SPACING.LARGE * 2),
  HEIGHT: 160,
  BORDER_RADIUS: 12,
};

// Calculate dynamic sizes based on screen width
export const dynamicSize = (size) => {
  const baseWidth = 375; // iPhone 8 width
  return (SCREEN_WIDTH / baseWidth) * size;
};