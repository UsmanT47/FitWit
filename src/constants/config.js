// API configuration
export const API_URL = 'https://fitwit-api.example.com/api';
export const NUTRITION_API_URL = 'https://nutrition-api.example.com/api';

// Feature flags
export const FEATURES = {
  BARCODE_SCANNING: true,
  VOICE_INPUT: true,
  ADVANCED_ANALYTICS: true,
  WEARABLE_SYNC: false, // Coming soon
  SOCIAL_SHARING: false, // Coming soon
};

// Default values
export const DEFAULT_VALUES = {
  WATER_GOAL: 8, // Default water goal in glasses
  SLEEP_GOAL: 8, // Default sleep goal in hours
  EXERCISE_GOAL: 30, // Default exercise goal in minutes
  STEP_GOAL: 10000, // Default step goal
};

// App info
export const APP_INFO = {
  VERSION: '1.0.0',
  BUILD: '1',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'h:mm a',
};

// Animation durations
export const ANIMATION = {
  DURATION_SHORT: 150,
  DURATION_MEDIUM: 300,
  DURATION_LONG: 500,
};

// Local storage keys (deprecated, use storageKeys from storageService instead)
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@fitwit_auth_token',
  USER_DATA: '@fitwit_user_data',
  THEME: '@fitwit_theme',
  ONBOARDING_COMPLETED: '@fitwit_onboarding_completed',
};

// Error messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH: 'Authentication failed. Please login again.',
  PERMISSION: 'Permission denied. Please grant the required permissions.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Successfully saved!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
};

// Timeouts
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  AUTHENTICATION: 10000, // 10 seconds
  SYNC: 20000, // 20 seconds
};