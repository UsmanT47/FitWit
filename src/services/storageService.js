import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_VALUES } from '../constants/config';
import { formatDate } from '../utils/dateUtils';

// Storage keys
export const storageKeys = {
  FOOD_LOGS: '@fitwit_food_logs',
  MOOD_LOGS: '@fitwit_mood_logs',
  EXERCISE_LOGS: '@fitwit_exercise_logs',
  SLEEP_LOGS: '@fitwit_sleep_logs',
  WATER_LOGS: '@fitwit_water_logs',
  HEALTH_LOGS: '@fitwit_health_logs',
  REMINDERS: '@fitwit_reminders',
  PREFERENCES: '@fitwit_preferences',
};

/**
 * Save user data for a specific date
 * @param {String} type Data type (food, mood, exercise, sleep, water)
 * @param {Object} data Data to save
 * @param {String} date Date in format YYYY-MM-DD (defaults to today)
 */
const saveData = async (type, data, date = null) => {
  if (!date) {
    date = formatDate(new Date());
  }
  
  try {
    // Determine the storage key based on type
    let storageKey;
    switch (type) {
      case 'food':
        storageKey = storageKeys.FOOD_LOGS;
        break;
      case 'mood':
        storageKey = storageKeys.MOOD_LOGS;
        break;
      case 'exercise':
        storageKey = storageKeys.EXERCISE_LOGS;
        break;
      case 'sleep':
        storageKey = storageKeys.SLEEP_LOGS;
        break;
      case 'water':
        storageKey = storageKeys.WATER_LOGS;
        break;
      case 'health':
        storageKey = storageKeys.HEALTH_LOGS;
        break;
      default:
        throw new Error(`Invalid data type: ${type}`);
    }
    
    // Get existing data
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    
    // Update data for the specific date
    existingData[date] = data;
    
    // Save back to storage
    await AsyncStorage.setItem(storageKey, JSON.stringify(existingData));
    
    return data;
  } catch (error) {
    console.error(`Error saving ${type} data:`, error);
    throw error;
  }
};

/**
 * Get user data for a specific date
 * @param {String} date Date in format YYYY-MM-DD (defaults to today)
 * @returns {Object} Object containing all user data for the date
 */
export const getUserData = async (date = null) => {
  if (!date) {
    date = formatDate(new Date());
  }
  
  try {
    // Get data from each storage key for the specified date
    const foodDataJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const moodDataJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const exerciseDataJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const sleepDataJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const waterDataJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    const healthDataJson = await AsyncStorage.getItem(storageKeys.HEALTH_LOGS);
    
    // Parse data
    const foodData = foodDataJson ? JSON.parse(foodDataJson)[date] || [] : [];
    const moodData = moodDataJson ? JSON.parse(moodDataJson)[date] || [] : [];
    const exerciseData = exerciseDataJson ? JSON.parse(exerciseDataJson)[date] || [] : [];
    const sleepData = sleepDataJson ? JSON.parse(sleepDataJson)[date] || [] : [];
    const waterData = waterDataJson ? JSON.parse(waterDataJson)[date] || [] : [];
    const healthData = healthDataJson ? JSON.parse(healthDataJson)[date] || [] : [];
    
    return {
      food: foodData,
      mood: moodData,
      exercise: exerciseData,
      sleep: sleepData,
      water: waterData,
      health: healthData,
      date,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      food: [],
      mood: [],
      exercise: [],
      sleep: [],
      water: [],
      health: [],
      date,
    };
  }
};

/**
 * Get historical data for a date range
 * @param {String} startDate Start date in format YYYY-MM-DD
 * @param {String} endDate End date in format YYYY-MM-DD
 * @returns {Object} Object containing all user data for the date range
 */
export const getHistoricalData = async (startDate, endDate) => {
  try {
    // Get all data
    const foodDataJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const moodDataJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const exerciseDataJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const sleepDataJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const waterDataJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    const healthDataJson = await AsyncStorage.getItem(storageKeys.HEALTH_LOGS);
    
    // Parse data
    const foodData = foodDataJson ? JSON.parse(foodDataJson) : {};
    const moodData = moodDataJson ? JSON.parse(moodDataJson) : {};
    const exerciseData = exerciseDataJson ? JSON.parse(exerciseDataJson) : {};
    const sleepData = sleepDataJson ? JSON.parse(sleepDataJson) : {};
    const waterData = waterDataJson ? JSON.parse(waterDataJson) : {};
    const healthData = healthDataJson ? JSON.parse(healthDataJson) : {};
    
    // Create date range array
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const dateRange = [];
    
    let currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      dateRange.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Filter data by date range
    const filteredFoodData = [];
    const filteredMoodData = [];
    const filteredExerciseData = [];
    const filteredSleepData = [];
    const filteredWaterData = [];
    const filteredHealthData = [];
    
    dateRange.forEach(date => {
      if (foodData[date]) filteredFoodData.push(...foodData[date]);
      if (moodData[date]) filteredMoodData.push(...moodData[date]);
      if (exerciseData[date]) filteredExerciseData.push(...exerciseData[date]);
      if (sleepData[date]) filteredSleepData.push(...sleepData[date]);
      if (waterData[date]) filteredWaterData.push(...waterData[date]);
      if (healthData[date]) filteredHealthData.push(...healthData[date]);
    });
    
    return {
      food: filteredFoodData,
      mood: filteredMoodData,
      exercise: filteredExerciseData,
      sleep: filteredSleepData,
      water: filteredWaterData,
      health: filteredHealthData,
      dates: dateRange,
    };
  } catch (error) {
    console.error('Error getting historical data:', error);
    return {
      food: [],
      mood: [],
      exercise: [],
      sleep: [],
      water: [],
      health: [],
      dates: [],
    };
  }
};

/**
 * Log food intake
 * @param {Object} foodData Food data to log
 * @returns {Object} Saved food data
 */
export const logFood = async (foodData) => {
  try {
    const date = formatDate(foodData.date || new Date());
    
    // Get existing food logs for this date
    const existingDataJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    let dateData = existingData[date] || [];
    
    // Add new food log with a unique ID
    const newFoodEntry = {
      id: Date.now().toString(),
      ...foodData,
      date,
      timestamp: new Date().toISOString(),
    };
    
    dateData.push(newFoodEntry);
    
    // Save back to storage
    existingData[date] = dateData;
    await AsyncStorage.setItem(storageKeys.FOOD_LOGS, JSON.stringify(existingData));
    
    return newFoodEntry;
  } catch (error) {
    console.error('Error logging food:', error);
    throw error;
  }
};

/**
 * Get food history
 * @returns {Array} Array of food log entries
 */
export const getFoodHistory = async () => {
  try {
    const foodDataJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const foodData = foodDataJson ? JSON.parse(foodDataJson) : {};
    
    // Flatten the data into a single array of entries
    const allEntries = [];
    Object.keys(foodData).forEach(date => {
      if (Array.isArray(foodData[date])) {
        allEntries.push(...foodData[date]);
      }
    });
    
    // Sort entries by date (newest first)
    return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting food history:', error);
    return [];
  }
};

/**
 * Log mood
 * @param {Object} moodData Mood data to log
 * @returns {Object} Saved mood data
 */
export const logMood = async (moodData) => {
  try {
    const date = formatDate(moodData.date || new Date());
    
    // Get existing mood logs for this date
    const existingDataJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    let dateData = existingData[date] || [];
    
    // Add new mood log with a unique ID
    const newMoodEntry = {
      id: Date.now().toString(),
      ...moodData,
      date,
      timestamp: new Date().toISOString(),
    };
    
    dateData.push(newMoodEntry);
    
    // Save back to storage
    existingData[date] = dateData;
    await AsyncStorage.setItem(storageKeys.MOOD_LOGS, JSON.stringify(existingData));
    
    return newMoodEntry;
  } catch (error) {
    console.error('Error logging mood:', error);
    throw error;
  }
};

/**
 * Get mood history
 * @returns {Array} Array of mood log entries
 */
export const getMoodHistory = async () => {
  try {
    const moodDataJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const moodData = moodDataJson ? JSON.parse(moodDataJson) : {};
    
    // Flatten the data into a single array of entries
    const allEntries = [];
    Object.keys(moodData).forEach(date => {
      if (Array.isArray(moodData[date])) {
        allEntries.push(...moodData[date]);
      }
    });
    
    // Sort entries by date (newest first)
    return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting mood history:', error);
    return [];
  }
};

/**
 * Log exercise
 * @param {Object} exerciseData Exercise data to log
 * @returns {Object} Saved exercise data
 */
export const logExercise = async (exerciseData) => {
  try {
    const date = formatDate(exerciseData.date || new Date());
    
    // Get existing exercise logs for this date
    const existingDataJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    let dateData = existingData[date] || [];
    
    // Add new exercise log with a unique ID
    const newExerciseEntry = {
      id: Date.now().toString(),
      ...exerciseData,
      date,
      timestamp: new Date().toISOString(),
    };
    
    dateData.push(newExerciseEntry);
    
    // Save back to storage
    existingData[date] = dateData;
    await AsyncStorage.setItem(storageKeys.EXERCISE_LOGS, JSON.stringify(existingData));
    
    return newExerciseEntry;
  } catch (error) {
    console.error('Error logging exercise:', error);
    throw error;
  }
};

/**
 * Get exercise history
 * @returns {Array} Array of exercise log entries
 */
export const getExerciseHistory = async () => {
  try {
    const exerciseDataJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const exerciseData = exerciseDataJson ? JSON.parse(exerciseDataJson) : {};
    
    // Flatten the data into a single array of entries
    const allEntries = [];
    Object.keys(exerciseData).forEach(date => {
      if (Array.isArray(exerciseData[date])) {
        allEntries.push(...exerciseData[date]);
      }
    });
    
    // Sort entries by date (newest first)
    return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting exercise history:', error);
    return [];
  }
};

/**
 * Log sleep
 * @param {Object} sleepData Sleep data to log
 * @returns {Object} Saved sleep data
 */
export const logSleep = async (sleepData) => {
  try {
    const date = formatDate(sleepData.date || new Date());
    
    // Get existing sleep logs for this date
    const existingDataJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    let dateData = existingData[date] || [];
    
    // Add new sleep log with a unique ID
    const newSleepEntry = {
      id: Date.now().toString(),
      ...sleepData,
      date,
      timestamp: new Date().toISOString(),
    };
    
    dateData.push(newSleepEntry);
    
    // Save back to storage
    existingData[date] = dateData;
    await AsyncStorage.setItem(storageKeys.SLEEP_LOGS, JSON.stringify(existingData));
    
    return newSleepEntry;
  } catch (error) {
    console.error('Error logging sleep:', error);
    throw error;
  }
};

/**
 * Get sleep history
 * @returns {Array} Array of sleep log entries
 */
export const getSleepHistory = async () => {
  try {
    const sleepDataJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const sleepData = sleepDataJson ? JSON.parse(sleepDataJson) : {};
    
    // Flatten the data into a single array of entries
    const allEntries = [];
    Object.keys(sleepData).forEach(date => {
      if (Array.isArray(sleepData[date])) {
        allEntries.push(...sleepData[date]);
      }
    });
    
    // Sort entries by date (newest first)
    return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting sleep history:', error);
    return [];
  }
};

/**
 * Update water intake
 * @param {Number} glasses Number of glasses
 * @param {Number} goal Goal number of glasses
 * @param {String} date Date in format YYYY-MM-DD (defaults to today)
 * @returns {Object} Saved water data
 */
export const updateWaterIntake = async (glasses, goal = DEFAULT_VALUES.WATER_GOAL, date = null) => {
  try {
    if (!date) {
      date = formatDate(new Date());
    }
    
    // Get existing water logs for this date
    const existingDataJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    
    // Update water intake for this date
    const waterEntry = {
      id: Date.now().toString(),
      glasses,
      goal,
      date,
      timestamp: new Date().toISOString(),
    };
    
    existingData[date] = [waterEntry]; // We only store one water entry per day
    
    // Save back to storage
    await AsyncStorage.setItem(storageKeys.WATER_LOGS, JSON.stringify(existingData));
    
    return waterEntry;
  } catch (error) {
    console.error('Error updating water intake:', error);
    throw error;
  }
};

/**
 * Get water history
 * @returns {Array} Array of water log entries
 */
export const getWaterHistory = async () => {
  try {
    const waterDataJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    const waterData = waterDataJson ? JSON.parse(waterDataJson) : {};
    
    // Flatten the data into a single array of entries
    const allEntries = [];
    Object.keys(waterData).forEach(date => {
      if (Array.isArray(waterData[date])) {
        allEntries.push(...waterData[date]);
      }
    });
    
    // Sort entries by date (newest first)
    return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting water history:', error);
    return [];
  }
};

/**
 * Get profile statistics
 * @returns {Object} User profile statistics
 */
export const getProfileStats = async () => {
  try {
    // Get the past 30 days of data
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDate = formatDate(thirtyDaysAgo);
    const endDate = formatDate(today);
    
    const data = await getHistoricalData(startDate, endDate);
    
    // Calculate streak days
    let streakDays = 0;
    const dates = new Set();
    
    // Get all dates with any logged data
    for (const date of data.dates) {
      const hasData = 
        hasDateLogs(date, data.food, data.mood, data.exercise, data.sleep, data.water);
      
      if (hasData) {
        dates.add(date);
      }
    }
    
    // Calculate current streak
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);
    let checking = true;
    
    while (checking) {
      const dateStr = formatDate(currentDate);
      
      if (dates.has(dateStr)) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        checking = false;
      }
    }
    
    // Calculate averages
    const sleepLogs = data.sleep;
    let totalSleepHours = 0;
    sleepLogs.forEach(log => {
      if (log.duration) {
        totalSleepHours += log.duration / 60; // Convert minutes to hours
      }
    });
    const averageSleep = sleepLogs.length > 0 ? totalSleepHours / sleepLogs.length : 0;
    
    // Calculate water intake average
    const waterLogs = data.water;
    let totalGlasses = 0;
    waterLogs.forEach(log => {
      if (log.glasses) {
        totalGlasses += log.glasses;
      }
    });
    const avgWaterIntake = waterLogs.length > 0 ? totalGlasses / waterLogs.length : 0;
    
    // Calculate completion rate (percentage of days with any logging)
    const completionRate = data.dates.length > 0 ? (dates.size / data.dates.length) * 100 : 0;
    
    return {
      streakDays,
      totalLogs: data.food.length + data.exercise.length + data.sleep.length + data.mood.length + data.water.length,
      completionRate: Math.round(completionRate),
      averageSleep: Math.round(averageSleep * 10) / 10, // Round to 1 decimal place
      avgWaterIntake: Math.round(avgWaterIntake * 10) / 10, // Round to 1 decimal place
    };
  } catch (error) {
    console.error('Error getting profile stats:', error);
    return {
      streakDays: 0,
      totalLogs: 0,
      completionRate: 0,
      averageSleep: 0,
      avgWaterIntake: 0,
    };
  }
};

/**
 * Check if a date has any log entries
 * @param {String} date Date to check
 * @param {Object} foodLogs Food logs
 * @param {Object} moodLogs Mood logs
 * @param {Object} exerciseLogs Exercise logs
 * @param {Object} sleepLogs Sleep logs
 * @param {Object} waterLogs Water logs
 * @returns {Boolean} True if the date has any logs
 */
const hasDateLogs = (date, foodLogs, moodLogs, exerciseLogs, sleepLogs, waterLogs) => {
  return (
    foodLogs.some(log => log.date === date) ||
    moodLogs.some(log => log.date === date) ||
    exerciseLogs.some(log => log.date === date) ||
    sleepLogs.some(log => log.date === date) ||
    waterLogs.some(log => log.date === date)
  );
};

/**
 * Get user reminders
 * @returns {Array} Array of reminder objects
 */
export const getReminders = async () => {
  try {
    const remindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

/**
 * Add a new reminder
 * @param {Object} reminder Reminder object
 * @returns {Object} Saved reminder
 */
export const addReminder = async (reminder) => {
  try {
    // Get existing reminders
    const existingRemindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const existingReminders = existingRemindersJson ? JSON.parse(existingRemindersJson) : [];
    
    // Add new reminder with a unique ID
    const newReminder = {
      id: Date.now().toString(),
      ...reminder,
      isActive: true,
    };
    
    // Save updated reminders
    const updatedReminders = [...existingReminders, newReminder];
    await AsyncStorage.setItem(storageKeys.REMINDERS, JSON.stringify(updatedReminders));
    
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

/**
 * Update an existing reminder
 * @param {String} id Reminder ID
 * @param {Object} updates Changes to apply to the reminder
 * @returns {Object} Updated reminder
 */
export const updateReminder = async (id, updates) => {
  try {
    // Get existing reminders
    const existingRemindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const existingReminders = existingRemindersJson ? JSON.parse(existingRemindersJson) : [];
    
    // Find and update the reminder
    const updatedReminders = existingReminders.map(reminder => {
      if (reminder.id === id) {
        return { ...reminder, ...updates };
      }
      return reminder;
    });
    
    // Save updated reminders
    await AsyncStorage.setItem(storageKeys.REMINDERS, JSON.stringify(updatedReminders));
    
    // Return the updated reminder
    return updatedReminders.find(reminder => reminder.id === id);
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

/**
 * Delete a reminder
 * @param {String} id Reminder ID
 */
export const deleteReminder = async (id) => {
  try {
    // Get existing reminders
    const existingRemindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const existingReminders = existingRemindersJson ? JSON.parse(existingRemindersJson) : [];
    
    // Filter out the reminder to delete
    const updatedReminders = existingReminders.filter(reminder => reminder.id !== id);
    
    // Save updated reminders
    await AsyncStorage.setItem(storageKeys.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getUserPreferences = async () => {
  try {
    const preferencesJson = await AsyncStorage.getItem(storageKeys.PREFERENCES);
    return preferencesJson ? JSON.parse(preferencesJson) : {};
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {};
  }
};

/**
 * Update user preferences
 * @param {Object} preferences Updated preferences
 * @returns {Object} Updated preferences
 */
export const updateUserPreferences = async (preferences) => {
  try {
    // Get existing preferences
    const existingPreferencesJson = await AsyncStorage.getItem(storageKeys.PREFERENCES);
    const existingPreferences = existingPreferencesJson ? JSON.parse(existingPreferencesJson) : {};
    
    // Merge with updated preferences
    const updatedPreferences = { ...existingPreferences, ...preferences };
    
    // Save updated preferences
    await AsyncStorage.setItem(storageKeys.PREFERENCES, JSON.stringify(updatedPreferences));
    
    return updatedPreferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

/**
 * Clear all user data
 */
export const clearAllData = async () => {
  try {
    const keys = Object.values(storageKeys);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};