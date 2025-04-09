/**
 * Global configuration for the FitWit app
 */

// API configurations
export const API_URL = process.env.API_URL || 'http://localhost:8000/api';

// Feature flags
export const FEATURES = {
  // Use local storage instead of API calls during development
  USE_LOCAL_STORAGE: true,
  
  // Enable mock nutrition API instead of Nutritionix
  USE_MOCK_NUTRITION_API: true,
  
  // Enable push notifications
  ENABLE_PUSH_NOTIFICATIONS: true,
  
  // Enable AI insights generation
  ENABLE_AI_INSIGHTS: true,
};

// App defaults
export const DEFAULT_VALUES = {
  // Default water goal in glasses/day
  WATER_GOAL: 8,
  
  // Default sleep goal in hours
  SLEEP_GOAL: 8,
  
  // Default date range for insights (in days)
  INSIGHTS_DATE_RANGE: 14,
};

// Analytics configuration
export const ANALYTICS = {
  ENABLED: false, // Set to true when analytics service is integrated
  TRACKING_ID: '', // Add tracking ID when analytics service is integrated
};

// Common IDs used in the app
export const DATA_TYPES = {
  FOOD: 'food',
  MOOD: 'mood',
  EXERCISE: 'exercise',
  SLEEP: 'sleep',
  WATER: 'water',
  CUSTOM: 'custom',
};

// Configuration for data visualization
export const VISUALIZATION_CONFIG = {
  CHART_COLORS: {
    FOOD: '#FF5722',    // Coral
    MOOD: '#2196F3',    // Blue
    EXERCISE: '#4CAF50', // Green
    SLEEP: '#9C27B0',   // Purple
    WATER: '#03A9F4',   // Light Blue
  },
  MAX_DATA_POINTS: 14, // Max number of data points to show on charts
};
