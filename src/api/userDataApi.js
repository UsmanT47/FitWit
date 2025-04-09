import axios from 'axios';
import { API_URL } from '../constants/config';

// Base URL for user data endpoints
const API_BASE_URL = `${API_URL}/user-data`;

// Create authorization header
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Log food entry
export const logFood = async (foodData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/food`, 
      foodData, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Log mood entry
export const logMood = async (moodData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/mood`, 
      moodData, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Log exercise entry
export const logExercise = async (exerciseData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/exercise`, 
      exerciseData, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Log sleep entry
export const logSleep = async (sleepData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sleep`, 
      sleepData, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Log water intake entry
export const logWater = async (waterData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/water`, 
      waterData, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get user logs by date range
export const getUserLogs = async (startDate, endDate, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/logs`, 
      { 
        params: { startDate, endDate },
        ...getAuthHeader(token)
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get insights based on user data
export const getUserInsights = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/insights`, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get user stats and summary
export const getUserStats = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stats`, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/preferences`, 
      preferences, 
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// For development - use local storage instead of API
export const localUserDataApi = {
  async logFood(foodData) {
    // Implementation will be provided by storageService
    return { success: true, data: foodData };
  },
  
  async logMood(moodData) {
    // Implementation will be provided by storageService
    return { success: true, data: moodData };
  },
  
  async logExercise(exerciseData) {
    // Implementation will be provided by storageService
    return { success: true, data: exerciseData };
  },
  
  async logSleep(sleepData) {
    // Implementation will be provided by storageService
    return { success: true, data: sleepData };
  },
  
  async logWater(waterData) {
    // Implementation will be provided by storageService
    return { success: true, data: waterData };
  },
  
  async getUserLogs(startDate, endDate) {
    // Implementation will be provided by storageService
    return { 
      success: true,
      data: {
        food: [],
        mood: [],
        exercise: [],
        sleep: [],
        water: []
      }
    };
  },
  
  async getUserInsights() {
    // Implementation will be provided by aiService
    return { 
      success: true,
      insights: [
        { 
          id: '1', 
          title: 'Sleep Pattern', 
          description: 'You sleep better on days you exercise.' 
        },
        { 
          id: '2', 
          title: 'Mood Correlation', 
          description: 'Your mood improves when you drink enough water.' 
        }
      ]
    };
  },
  
  async getUserStats() {
    // Implementation will be provided by storageService
    return {
      success: true,
      stats: {
        averageSleep: 7.5,
        averageWater: 6,
        moodTrend: 'positive',
        totalExerciseMinutes: 180
      }
    };
  },
  
  async updateUserPreferences(preferences) {
    // Implementation will be provided by storageService
    return { success: true, preferences };
  }
};

// Helper to handle API errors
const handleApiError = (error) => {
  console.error('User Data API Error:', error.response?.data || error.message);
  
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred with user data',
      error: error.response.data
    };
  }
  
  return {
    status: 500,
    message: error.message || 'Network error occurred',
    error: error
  };
};
