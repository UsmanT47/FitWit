// API endpoints
export const API_URL = 'https://fitwit-api.example.com/api';
export const NUTRITION_API_URL = 'https://nutrition-api.example.com/api';

// Feature flags
export const FEATURES = {
  BARCODE_SCANNER: true,
  VOICE_INPUT: true,
  HEALTH_SYNC: true,
  AI_INSIGHTS: true,
  REMINDERS: true,
  SOCIAL_SHARING: false, // Planned for future release
  EXPORT_DATA: false, // Planned for future release
  CHALLENGES: false, // Planned for future release
};

// Default values
export const DEFAULT_VALUES = {
  WATER_GOAL: 2000, // ml
  SLEEP_GOAL: 8, // hours
  CALORIES_GOAL: 2000, // kcal
  STEPS_GOAL: 10000, // steps
  EXERCISE_GOAL: 30, // minutes
};

// App information
export const APP_INFO = {
  NAME: 'FitWit',
  VERSION: '1.0.0',
  BUILD: '1',
  DESCRIPTION: 'Your personal health and fitness companion',
  WEBSITE: 'https://fitwit.example.com',
  PRIVACY_POLICY: 'https://fitwit.example.com/privacy',
  TERMS: 'https://fitwit.example.com/terms',
  SUPPORT_EMAIL: 'support@fitwit.example.com',
};

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Date format constants
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM D, YYYY',
  DISPLAY_TIME: 'h:mm A',
  DISPLAY_DATE_TIME: 'MMM D, YYYY h:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATE_TIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DAY_NAME: 'dddd',
  MONTH_NAME: 'MMMM',
  YEAR: 'YYYY',
};

// Animation constants
export const ANIMATION = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    EASE_IN: 'easeIn',
    EASE_OUT: 'easeOut',
    EASE_IN_OUT: 'easeInOut',
  },
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  TOKEN: '@FitWit:token',
  USER: '@FitWit:user',
  THEME_MODE: '@FitWit:themeMode',
  ONBOARDING_COMPLETED: '@FitWit:onboardingCompleted',
  HEALTH_DATA: '@FitWit:healthData',
  FOOD_LOGS: '@FitWit:foodLogs',
  WATER_LOGS: '@FitWit:waterLogs',
  EXERCISE_LOGS: '@FitWit:exerciseLogs',
  SLEEP_LOGS: '@FitWit:sleepLogs',
  MOOD_LOGS: '@FitWit:moodLogs',
  REMINDERS: '@FitWit:reminders',
  PREFERENCES: '@FitWit:preferences',
  LAST_SYNC: '@FitWit:lastSync',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  SERVER: 'Server error. Please try again later.',
  AUTH: 'Authentication error. Please log in again.',
  PERMISSION: 'Permission denied. You do not have access to this feature.',
  VALIDATION: 'Validation error. Please check your input.',
  NOT_FOUND: 'Resource not found.',
  UNKNOWN: 'An unknown error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTER: 'Registration successful! Welcome to FitWit.',
  LOGIN: 'Login successful!',
  LOGOUT: 'You have been logged out.',
  PROFILE_UPDATE: 'Profile updated successfully.',
  PASSWORD_RESET: 'Password reset email sent.',
  PASSWORD_CHANGE: 'Password changed successfully.',
  DATA_SAVED: 'Data saved successfully.',
  SYNC_COMPLETE: 'Sync completed successfully.',
};

// Timeout durations (ms)
export const TIMEOUTS = {
  API_REQUEST: 10000,
  DEBOUNCE: 300,
  TOAST: 3000,
  ANIMATION: 300,
};