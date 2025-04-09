import { Dimensions, Platform } from 'react-native';

// Screen dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

// Responsive calculations
const baseWidth = 375; // iPhone 8/SE
export const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;

// Spacing
export const SPACING = {
  XXXS: 2,
  XXS: 4,
  XS: 8,
  S: 12,
  M: 16,
  L: 20,
  XL: 24,
  XXL: 32,
  XXXL: 40,
  XXXXL: 48,
  SCREEN_HORIZONTAL: 20,
  SCREEN_VERTICAL: 16,
};

// Border radius
export const BORDER_RADIUS = {
  XS: 4,
  S: 8,
  M: 12,
  L: 16,
  XL: 20,
  XXL: 28,
  CIRCLE: 999,
};

// Font sizes
export const FONT_SIZES = {
  CAPTION: 12,
  SMALL: 14,
  MEDIUM: 16,
  LARGE: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  XXXXL: 32,
  DISPLAY: 40,
};

// Icon sizes
export const ICON_SIZES = {
  TINY: 16,
  SMALL: 20,
  MEDIUM: 24,
  LARGE: 28,
  XL: 32,
  XXL: 40,
};

// Shadows
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  XL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Header heights
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
export const HEADER_HEIGHT_EXPANDED = Platform.OS === 'ios' ? 128 : 104;

// Bottom tab height
export const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 83 : 64; // Includes safe area on iOS

// Input components
export const INPUT_HEIGHT = 48;
export const INPUT_HEIGHT_SMALL = 36;

// Avatar sizes
export const AVATAR_SIZES = {
  SMALL: 32,
  MEDIUM: 40,
  LARGE: 56,
  XL: 80,
  XXL: 100,
};

// Card dimensions
export const CARD = {
  BORDER_RADIUS: 16,
  PADDING: 16,
  MARGIN: 16,
};

// Function to calculate dynamic sizes based on screen size
export const dynamicSize = (size) => {
  const baseWidth = 375; // Base width (iPhone 8/SE)
  const percentage = size / baseWidth; // Get percentage of screen width
  return Math.round(SCREEN_WIDTH * percentage); // Return the calculated size
};