// Brand colors
export const BRAND = {
  PRIMARY: '#4285F4',   // Google Blue
  SECONDARY: '#34A853', // Google Green
  ACCENT: '#EA4335',    // Google Red
  NEUTRAL: '#FBBC05',   // Google Yellow
};

// Light theme
export const lightTheme = {
  // Primary colors
  primary: {
    main: BRAND.PRIMARY,
    light: '#A8C7FA', 
    dark: '#1967D2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: BRAND.SECONDARY,
    light: '#CEEAD6',
    dark: '#137333',
    contrastText: '#FFFFFF',
  },
  
  // UI state colors
  success: {
    main: '#34A853',
    light: '#CEEAD6',
    dark: '#137333',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EA4335',
    light: '#FADAD6',
    dark: '#B31412',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FBBC05',
    light: '#FEF7E0',
    dark: '#EA8600',
    contrastText: '#000000',
  },
  info: {
    main: '#4285F4',
    light: '#E8F0FE',
    dark: '#1967D2',
    contrastText: '#FFFFFF',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#ECEFF1',
    highlight: '#E8F0FE',
  },
  
  // Text colors
  text: {
    primary: '#202124',    // Nearly black
    secondary: '#5F6368',  // Dark gray
    tertiary: '#80868B',   // Medium gray
    disabled: '#BDC1C6',   // Light gray
    inverse: '#FFFFFF',    // White (for dark backgrounds)
  },
  
  // Input styles
  input: {
    background: '#FFFFFF',
    border: '#DADCE0',
    placeholder: '#80868B',
    focus: '#4285F4',
  },
  
  // Border
  border: '#DADCE0',
  
  // Is dark mode
  isDarkMode: false,
};

// Dark theme
export const darkTheme = {
  // Primary colors
  primary: {
    main: '#8AB4F8',       // Light blue
    light: '#D2E3FC',
    dark: '#4285F4',
    contrastText: '#202124',
  },
  secondary: {
    main: '#81C995',       // Light green
    light: '#CEEAD6',
    dark: '#34A853',
    contrastText: '#202124',
  },
  
  // UI state colors
  success: {
    main: '#81C995',
    light: '#CEEAD6',
    dark: '#34A853',
    contrastText: '#202124',
  },
  error: {
    main: '#F28B82',
    light: '#FADAD6',
    dark: '#EA4335',
    contrastText: '#202124',
  },
  warning: {
    main: '#FDD663',
    light: '#FEF7E0',
    dark: '#FBBC05',
    contrastText: '#202124',
  },
  info: {
    main: '#8AB4F8',
    light: '#E8F0FE',
    dark: '#4285F4',
    contrastText: '#202124',
  },
  
  // Background colors
  background: {
    primary: '#202124',     // Nearly black
    secondary: '#303134',   // Dark gray
    tertiary: '#3C4043',    // Medium gray
    highlight: '#303134',
  },
  
  // Text colors
  text: {
    primary: '#E8EAED',     // White-ish
    secondary: '#BDC1C6',   // Light gray
    tertiary: '#9AA0A6',    // Medium gray
    disabled: '#5F6368',    // Dark gray
    inverse: '#202124',     // Nearly black (for light backgrounds)
  },
  
  // Input styles
  input: {
    background: '#303134',
    border: '#5F6368',
    placeholder: '#9AA0A6',
    focus: '#8AB4F8',
  },
  
  // Border
  border: '#5F6368',
  
  // Is dark mode
  isDarkMode: true,
};