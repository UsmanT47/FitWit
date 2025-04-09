import { Platform } from 'react-native';

// Brand colors
export const BRAND = {
  primary: '#4285F4', // Google Blue
  secondary: '#34A853', // Google Green
  tertiary: '#FBBC05', // Google Yellow
  quaternary: '#EA4335', // Google Red
  neutral: '#5F6368', // Google Grey
};

// Light theme
export const lightTheme = {
  // Background colors
  background: {
    primary: '#FFFFFF', // Main background
    secondary: '#F8F9FA', // Secondary background (cards, etc.)
    tertiary: '#F1F3F4', // Tertiary background (inputs, etc.)
    highlight: '#E8F0FE', // Highlight background
  },
  
  // Text colors
  text: {
    primary: '#202124', // Primary text
    secondary: '#5F6368', // Secondary text
    tertiary: '#9AA0A6', // Tertiary text
    disabled: '#BDC1C6', // Disabled text
    inverse: '#FFFFFF', // Inverse text (on dark backgrounds)
  },
  
  // Primary brand colors
  primary: {
    main: BRAND.primary,
    dark: '#3367D6',
    light: '#8AB4F8',
  },
  
  // Secondary brand colors
  secondary: {
    main: BRAND.secondary,
    dark: '#137333',
    light: '#81C995',
  },
  
  // Error, warning, info, success colors
  error: {
    main: '#EA4335',
    light: '#F6AEA9',
    dark: '#C5221F',
  },
  warning: {
    main: '#FBBC05',
    light: '#FDE293',
    dark: '#F29900',
  },
  info: {
    main: '#4285F4',
    light: '#8AB4F8',
    dark: '#3367D6',
  },
  success: {
    main: '#34A853',
    light: '#81C995',
    dark: '#137333',
  },
  
  // Border colors
  border: '#DADCE0',
  divider: '#DADCE0',
  
  // Card colors
  card: {
    background: '#FFFFFF',
    border: '#DADCE0',
    shadow: 'rgba(60, 64, 67, 0.3)',
  },
  
  // Input colors
  input: {
    background: '#F1F3F4',
    border: '#DADCE0',
    placeholder: '#9AA0A6',
  },
  
  // Button colors
  button: {
    primary: {
      background: BRAND.primary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      background: '#FFFFFF',
      text: BRAND.primary,
      border: BRAND.primary,
    },
    tertiary: {
      background: 'transparent',
      text: BRAND.primary,
      border: 'transparent',
    },
    disabled: {
      background: '#F1F3F4',
      text: '#9AA0A6',
      border: 'transparent',
    },
  },
  
  // Status bar style (light-content or dark-content)
  statusBar: 'dark-content',
  
  // Tab bar colors
  tabBar: {
    active: BRAND.primary,
    inactive: '#9AA0A6',
    background: '#FFFFFF',
    border: '#DADCE0',
  },
  
  // Switch colors
  switch: {
    active: BRAND.primary,
    inactive: '#BDC1C6',
    thumb: '#FFFFFF',
  },
  
  // Animation colors
  skeleton: {
    start: '#F1F3F4',
    end: '#E8EAED',
  },
  
  // Shadow properties
  shadow: {
    color: 'rgba(60, 64, 67, 0.3)',
    offset: { width: 0, height: 2 },
    opacity: 0.2,
    radius: 8,
    elevation: 2,
  },
};

// Dark theme
export const darkTheme = {
  // Background colors
  background: {
    primary: '#121212', // Main background
    secondary: '#1E1E1E', // Secondary background (cards, etc.)
    tertiary: '#2A2A2A', // Tertiary background (inputs, etc.)
    highlight: '#3C4043', // Highlight background
  },
  
  // Text colors
  text: {
    primary: '#E8EAED', // Primary text
    secondary: '#9AA0A6', // Secondary text
    tertiary: '#5F6368', // Tertiary text
    disabled: '#5F6368', // Disabled text
    inverse: '#202124', // Inverse text (on light backgrounds)
  },
  
  // Primary brand colors
  primary: {
    main: BRAND.primary,
    dark: '#8AB4F8',
    light: '#3367D6',
  },
  
  // Secondary brand colors
  secondary: {
    main: BRAND.secondary,
    dark: '#81C995',
    light: '#137333',
  },
  
  // Error, warning, info, success colors
  error: {
    main: '#EA4335',
    light: '#C5221F',
    dark: '#F6AEA9',
  },
  warning: {
    main: '#FBBC05',
    light: '#F29900',
    dark: '#FDE293',
  },
  info: {
    main: '#4285F4',
    light: '#3367D6',
    dark: '#8AB4F8',
  },
  success: {
    main: '#34A853',
    light: '#137333',
    dark: '#81C995',
  },
  
  // Border colors
  border: '#5F6368',
  divider: '#3C4043',
  
  // Card colors
  card: {
    background: '#1E1E1E',
    border: '#3C4043',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Input colors
  input: {
    background: '#2A2A2A',
    border: '#5F6368',
    placeholder: '#5F6368',
  },
  
  // Button colors
  button: {
    primary: {
      background: BRAND.primary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      background: '#2A2A2A',
      text: BRAND.primary,
      border: BRAND.primary,
    },
    tertiary: {
      background: 'transparent',
      text: BRAND.primary,
      border: 'transparent',
    },
    disabled: {
      background: '#2A2A2A',
      text: '#5F6368',
      border: 'transparent',
    },
  },
  
  // Status bar style (light-content or dark-content)
  statusBar: 'light-content',
  
  // Tab bar colors
  tabBar: {
    active: BRAND.primary,
    inactive: '#9AA0A6',
    background: '#1E1E1E',
    border: '#3C4043',
  },
  
  // Switch colors
  switch: {
    active: BRAND.primary,
    inactive: '#5F6368',
    thumb: '#E8EAED',
  },
  
  // Animation colors
  skeleton: {
    start: '#2A2A2A',
    end: '#3C4043',
  },
  
  // Shadow properties
  shadow: {
    color: 'rgba(0, 0, 0, 0.5)',
    offset: { width: 0, height: 2 },
    opacity: 0.5,
    radius: 8,
    elevation: 4,
  },
};