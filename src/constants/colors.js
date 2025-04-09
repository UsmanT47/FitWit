// Define color palette for the app
const palette = {
  // Primary colors
  teal: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#009688',
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },
  
  // Secondary colors
  coral: {
    50: '#FBE9E7',
    100: '#FFCCBC',
    200: '#FFAB91',
    300: '#FF8A65',
    400: '#FF7043',
    500: '#FF5722',
    600: '#F4511E',
    700: '#E64A19',
    800: '#D84315',
    900: '#BF360C',
  },
  
  // Neutral colors
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
  info: '#2196F3',
  
  // Other
  white: '#FFFFFF',
  black: '#000000',
  
  // Mood colors
  mood: {
    terrible: '#F44336', // Red
    bad: '#FF9800',      // Orange
    neutral: '#9E9E9E',  // Gray
    good: '#4CAF50',     // Green
    great: '#2196F3',    // Blue
  },
  
  // Water progress colors
  water: {
    low: '#F44336',     // Red
    medium: '#FFC107',  // Amber
    high: '#2196F3',    // Blue
  },
};

// Light theme colors
export const lightTheme = {
  // Base
  primary: palette.teal[600],
  secondary: palette.coral[500],
  background: palette.white,
  cardBackground: palette.white,
  
  // Text
  text: palette.gray[900],
  textSecondary: palette.gray[600],
  textTertiary: palette.gray[500],
  
  // UI Elements
  border: palette.gray[300],
  headerBackground: palette.white,
  divider: palette.gray[200],
  input: palette.white,
  inputBorder: palette.gray[300],
  
  // Buttons
  buttonPrimaryBackground: palette.teal[600],
  buttonPrimaryText: palette.white,
  buttonSecondaryBackground: palette.gray[100],
  buttonSecondaryBorder: palette.gray[300],
  buttonSecondaryText: palette.gray[900],
  
  // Progress & Status
  progressBarBackground: palette.gray[200],
  switchTrackOn: palette.teal[400],
  switchTrackOff: palette.gray[300],
  switchThumb: palette.white,
  
  // Feature specific
  insightIconBackground: `${palette.teal[500]}20`, // 20% opacity
  reminderIconBackground: `${palette.coral[500]}20`, // 20% opacity
  waterControlBackground: palette.gray[100],
  
  // Mood colors
  moodColors: {
    terrible: palette.mood.terrible,
    bad: palette.mood.bad,
    neutral: palette.mood.neutral,
    good: palette.mood.good,
    great: palette.mood.great,
  },
  moodBackground: palette.gray[100],
  
  // Water progress colors
  waterProgress: {
    low: palette.water.low,
    medium: palette.water.medium,
    high: palette.water.high,
  },
  
  // Semantic
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
};

// Dark theme colors
export const darkTheme = {
  // Base
  primary: palette.teal[400],
  secondary: palette.coral[400],
  background: palette.gray[900],
  cardBackground: palette.gray[800],
  
  // Text
  text: palette.gray[100],
  textSecondary: palette.gray[400],
  textTertiary: palette.gray[500],
  
  // UI Elements
  border: palette.gray[700],
  headerBackground: palette.gray[900],
  divider: palette.gray[700],
  input: palette.gray[800],
  inputBorder: palette.gray[700],
  
  // Buttons
  buttonPrimaryBackground: palette.teal[500],
  buttonPrimaryText: palette.white,
  buttonSecondaryBackground: palette.gray[700],
  buttonSecondaryBorder: palette.gray[600],
  buttonSecondaryText: palette.white,
  
  // Progress & Status
  progressBarBackground: palette.gray[700],
  switchTrackOn: palette.teal[500],
  switchTrackOff: palette.gray[600],
  switchThumb: palette.white,
  
  // Feature specific
  insightIconBackground: `${palette.teal[500]}30`, // 30% opacity
  reminderIconBackground: `${palette.coral[500]}30`, // 30% opacity
  waterControlBackground: palette.gray[700],
  
  // Mood colors - slightly lighter for dark theme
  moodColors: {
    terrible: palette.mood.terrible,
    bad: palette.mood.bad,
    neutral: palette.mood.neutral,
    good: palette.mood.good,
    great: palette.mood.great,
  },
  moodBackground: palette.gray[700],
  
  // Water progress colors
  waterProgress: {
    low: palette.water.low,
    medium: palette.water.medium,
    high: palette.water.high,
  },
  
  // Semantic
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
};

export default {
  palette,
  lightTheme,
  darkTheme,
};
