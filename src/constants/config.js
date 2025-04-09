// API endpoints
export const API_URL = 'https://fitwit-api.example.com/api';
export const NUTRITION_API_URL = 'https://nutrition-api.example.com/api';

// Feature flags
export const FEATURES = {
  BARCODE_SCANNER: true,
  VOICE_INPUT: true,
  FITBIT_SYNC: true,
  APPLE_HEALTH_SYNC: true,
  GOOGLE_FIT_SYNC: true,
  REMINDERS: true,
  AI_INSIGHTS: true,
};

// Default values
export const DEFAULT_VALUES = {
  WATER_GOAL: 2000, // ml
  STEPS_GOAL: 10000,
  SLEEP_GOAL: 8, // hours
  DAILY_CALORIES: 2000,
};

// App information
export const APP_INFO = {
  NAME: 'FitWit',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your personal health and fitness companion',
  WEBSITE: 'https://fitwit.example.com',
  SUPPORT_EMAIL: 'support@fitwit.example.com',
};

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMMM d, yyyy',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATETIME: 'MMMM d, yyyy h:mm a',
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
};

// Animation durations
export const ANIMATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: '@FitWit:token',
  USER: '@FitWit:user',
  THEME_MODE: '@FitWit:themeMode',
  ONBOARDING_COMPLETED: '@FitWit:onboardingCompleted',
  HEALTH_DATA: '@FitWit:healthData',
  REMINDERS: '@FitWit:reminders',
  PREFERENCES: '@FitWit:preferences',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  SERVER: 'Server error. Please try again later.',
  AUTHENTICATION: 'Authentication failed. Please log in again.',
  PERMISSION_DENIED: 'Permission denied. Please check your app settings.',
  UNKNOWN: 'An unknown error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  DATA_SAVED: 'Data saved successfully!',
  REMINDER_SET: 'Reminder set successfully!',
};

// Timeouts
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10 seconds
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE: 300, // 300 milliseconds
};