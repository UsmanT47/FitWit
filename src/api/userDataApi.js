import { API_URL } from '../constants/config';

/**
 * Log food consumption
 * @param {Object} foodData Food data to log
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with saved food log
 */
export const logFood = async (foodData, token) => {
  try {
    const response = await fetch(`${API_URL}/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(foodData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log food');
    }
    
    return data;
  } catch (error) {
    console.error('Log food API error:', error);
    throw error;
  }
};

/**
 * Log mood
 * @param {Object} moodData Mood data to log
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with saved mood log
 */
export const logMood = async (moodData, token) => {
  try {
    const response = await fetch(`${API_URL}/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(moodData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log mood');
    }
    
    return data;
  } catch (error) {
    console.error('Log mood API error:', error);
    throw error;
  }
};

/**
 * Log exercise
 * @param {Object} exerciseData Exercise data to log
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with saved exercise log
 */
export const logExercise = async (exerciseData, token) => {
  try {
    const response = await fetch(`${API_URL}/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(exerciseData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log exercise');
    }
    
    return data;
  } catch (error) {
    console.error('Log exercise API error:', error);
    throw error;
  }
};

/**
 * Log sleep
 * @param {Object} sleepData Sleep data to log
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with saved sleep log
 */
export const logSleep = async (sleepData, token) => {
  try {
    const response = await fetch(`${API_URL}/sleep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sleepData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log sleep');
    }
    
    return data;
  } catch (error) {
    console.error('Log sleep API error:', error);
    throw error;
  }
};

/**
 * Log water consumption
 * @param {Object} waterData Water data to log
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with saved water log
 */
export const logWater = async (waterData, token) => {
  try {
    const response = await fetch(`${API_URL}/water`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(waterData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log water');
    }
    
    return data;
  } catch (error) {
    console.error('Log water API error:', error);
    throw error;
  }
};

/**
 * Get user logs for a date range
 * @param {String} startDate Start date in format YYYY-MM-DD
 * @param {String} endDate End date in format YYYY-MM-DD
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with user logs
 */
export const getUserLogs = async (startDate, endDate, token) => {
  try {
    const response = await fetch(
      `${API_URL}/logs?startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user logs');
    }
    
    return data;
  } catch (error) {
    console.error('Get user logs API error:', error);
    throw error;
  }
};

/**
 * Get user insights
 * @param {String} token Authentication token
 * @returns {Promise<Array>} Response with user insights
 */
export const getUserInsights = async (token) => {
  try {
    const response = await fetch(`${API_URL}/insights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user insights');
    }
    
    return data;
  } catch (error) {
    console.error('Get user insights API error:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with user statistics
 */
export const getUserStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user statistics');
    }
    
    return data;
  } catch (error) {
    console.error('Get user stats API error:', error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {Object} preferences User preferences
 * @param {String} token Authentication token
 * @returns {Promise<Object>} Response with updated preferences
 */
export const updateUserPreferences = async (preferences, token) => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update preferences');
    }
    
    return data;
  } catch (error) {
    console.error('Update preferences API error:', error);
    throw error;
  }
};

// Local implementation for testing/development without backend
export const localUserDataApi = {
  async logFood(foodData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: Date.now().toString(),
      ...foodData,
      createdAt: new Date().toISOString(),
    };
  },
  
  async logMood(moodData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: Date.now().toString(),
      ...moodData,
      createdAt: new Date().toISOString(),
    };
  },
  
  async logExercise(exerciseData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: Date.now().toString(),
      ...exerciseData,
      createdAt: new Date().toISOString(),
    };
  },
  
  async logSleep(sleepData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: Date.now().toString(),
      ...sleepData,
      createdAt: new Date().toISOString(),
    };
  },
  
  async logWater(waterData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: Date.now().toString(),
      ...waterData,
      createdAt: new Date().toISOString(),
    };
  },
  
  async getUserLogs(startDate, endDate) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock response with empty log arrays
    return {
      food: [],
      exercise: [],
      sleep: [],
      mood: [],
      water: [],
    };
  },
  
  async getUserInsights() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock insights
    return [
      {
        id: '1',
        type: 'sleep',
        title: 'Sleep Pattern Detected',
        content: 'You sleep better on days when you exercise in the morning. Consider scheduling workouts before 10 AM.',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'nutrition',
        title: 'Nutrition Recommendation',
        content: 'Your protein intake has been below target for the past week. Try adding more lean protein sources to your meals.',
        createdAt: new Date().toISOString(),
      },
    ];
  },
  
  async getUserStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock stats
    return {
      streakDays: 3,
      totalLogs: 12,
      completionRate: 85,
      averageSleep: 7.2,
      avgWaterIntake: 6,
    };
  },
  
  async updateUserPreferences(preferences) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return updated preferences
    return {
      ...preferences,
      updatedAt: new Date().toISOString(),
    };
  },
};