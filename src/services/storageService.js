import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate } from '../utils/dateUtils';
import { DEFAULT_VALUES } from '../constants/config';
import { scheduleReminder, cancelNotification } from './notificationService';

// Storage keys
export const storageKeys = {
  USER: 'user_data',
  TOKEN: 'auth_token',
  THEME_MODE: 'theme_mode',
  FOOD_LOGS: 'food_logs',
  MOOD_LOGS: 'mood_logs',
  EXERCISE_LOGS: 'exercise_logs',
  SLEEP_LOGS: 'sleep_logs',
  WATER_LOGS: 'water_logs',
  REMINDERS: 'reminders',
  PREFERENCES: 'user_preferences',
};

/**
 * Save user data for a specific date
 * @param {String} type Data type (food, mood, exercise, sleep, water)
 * @param {Object} data Data to save
 * @param {String} date Date in format YYYY-MM-DD (defaults to today)
 */
const saveUserData = async (type, data, date = null) => {
  if (!type || !data) return;
  
  try {
    // Use provided date or default to today
    const formattedDate = date || formatDate(new Date(), 'yyyy-MM-dd');
    
    // Determine storage key based on type
    let storageKey;
    switch (type.toLowerCase()) {
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
      default:
        throw new Error('Invalid data type');
    }
    
    // Get existing data for this type
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    
    // Update data for the specified date
    if (!existingData[formattedDate]) {
      existingData[formattedDate] = [];
    }
    
    // Add an ID to the data if it doesn't have one
    const newData = { ...data };
    if (!newData.id) {
      newData.id = Date.now().toString();
    }
    
    // Add the data to the array for this date
    existingData[formattedDate].push(newData);
    
    // Save the updated data
    await AsyncStorage.setItem(storageKey, JSON.stringify(existingData));
    
    return newData;
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
  try {
    // Use provided date or default to today
    const formattedDate = date || formatDate(new Date(), 'yyyy-MM-dd');
    
    // Get data for each type
    const foodLogsJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const moodLogsJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const exerciseLogsJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const sleepLogsJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const waterLogsJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    
    // Parse the data
    const foodLogs = foodLogsJson ? JSON.parse(foodLogsJson) : {};
    const moodLogs = moodLogsJson ? JSON.parse(moodLogsJson) : {};
    const exerciseLogs = exerciseLogsJson ? JSON.parse(exerciseLogsJson) : {};
    const sleepLogs = sleepLogsJson ? JSON.parse(sleepLogsJson) : {};
    const waterLogs = waterLogsJson ? JSON.parse(waterLogsJson) : {};
    
    // Get data for the specified date
    return {
      food: foodLogs[formattedDate] || [],
      mood: moodLogs[formattedDate] || [],
      exercise: exerciseLogs[formattedDate] || [],
      sleep: sleepLogs[formattedDate] || [],
      water: waterLogs[formattedDate] 
        ? waterLogs[formattedDate][0]  // Water is stored as an array, but we only care about the latest entry
        : { glasses: 0, goal: DEFAULT_VALUES.WATER_GOAL }
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      food: [],
      mood: [],
      exercise: [],
      sleep: [],
      water: { glasses: 0, goal: DEFAULT_VALUES.WATER_GOAL }
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
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }
    
    // Get data for each type
    const foodLogsJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const moodLogsJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const exerciseLogsJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const sleepLogsJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const waterLogsJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    
    // Parse the data
    const foodLogs = foodLogsJson ? JSON.parse(foodLogsJson) : {};
    const moodLogs = moodLogsJson ? JSON.parse(moodLogsJson) : {};
    const exerciseLogs = exerciseLogsJson ? JSON.parse(exerciseLogsJson) : {};
    const sleepLogs = sleepLogsJson ? JSON.parse(sleepLogsJson) : {};
    const waterLogs = waterLogsJson ? JSON.parse(waterLogsJson) : {};
    
    // Initialize arrays for each data type
    const food = [];
    const mood = [];
    const exercise = [];
    const sleep = [];
    const water = [];
    
    // Iterate through the date range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = formatDate(currentDate, 'yyyy-MM-dd');
      
      // Add data for this date if it exists
      if (foodLogs[dateString]) {
        food.push(...foodLogs[dateString].map(item => ({ ...item, date: dateString })));
      }
      
      if (moodLogs[dateString]) {
        mood.push(...moodLogs[dateString].map(item => ({ ...item, date: dateString })));
      }
      
      if (exerciseLogs[dateString]) {
        exercise.push(...exerciseLogs[dateString].map(item => ({ ...item, date: dateString })));
      }
      
      if (sleepLogs[dateString]) {
        sleep.push(...sleepLogs[dateString].map(item => ({ ...item, date: dateString })));
      }
      
      if (waterLogs[dateString]) {
        water.push(...waterLogs[dateString].map(item => ({ ...item, date: dateString })));
      }
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { food, mood, exercise, sleep, water };
  } catch (error) {
    console.error('Error getting historical data:', error);
    return { food: [], mood: [], exercise: [], sleep: [], water: [] };
  }
};

/**
 * Log food intake
 * @param {Object} foodData Food data to log
 * @returns {Object} Saved food data
 */
export const logFood = async (foodData) => {
  if (!foodData) throw new Error('Food data is required');
  
  try {
    const date = foodData.date || formatDate(new Date(), 'yyyy-MM-dd');
    return await saveUserData('food', foodData, date);
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
    const foodLogsJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const foodLogs = foodLogsJson ? JSON.parse(foodLogsJson) : {};
    
    // Flatten the data and sort by date (newest first)
    const flattenedData = [];
    Object.entries(foodLogs).forEach(([date, entries]) => {
      entries.forEach(entry => {
        flattenedData.push({ ...entry, date });
      });
    });
    
    return flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  if (!moodData) throw new Error('Mood data is required');
  
  try {
    const date = moodData.date || formatDate(new Date(), 'yyyy-MM-dd');
    return await saveUserData('mood', moodData, date);
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
    const moodLogsJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const moodLogs = moodLogsJson ? JSON.parse(moodLogsJson) : {};
    
    // Flatten the data and sort by date (newest first)
    const flattenedData = [];
    Object.entries(moodLogs).forEach(([date, entries]) => {
      entries.forEach(entry => {
        flattenedData.push({ ...entry, date });
      });
    });
    
    return flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  if (!exerciseData) throw new Error('Exercise data is required');
  
  try {
    const date = exerciseData.date || formatDate(new Date(), 'yyyy-MM-dd');
    return await saveUserData('exercise', exerciseData, date);
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
    const exerciseLogsJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const exerciseLogs = exerciseLogsJson ? JSON.parse(exerciseLogsJson) : {};
    
    // Flatten the data and sort by date (newest first)
    const flattenedData = [];
    Object.entries(exerciseLogs).forEach(([date, entries]) => {
      entries.forEach(entry => {
        flattenedData.push({ ...entry, date });
      });
    });
    
    return flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  if (!sleepData) throw new Error('Sleep data is required');
  
  try {
    const date = sleepData.date || formatDate(new Date(), 'yyyy-MM-dd');
    return await saveUserData('sleep', sleepData, date);
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
    const sleepLogsJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const sleepLogs = sleepLogsJson ? JSON.parse(sleepLogsJson) : {};
    
    // Flatten the data and sort by date (newest first)
    const flattenedData = [];
    Object.entries(sleepLogs).forEach(([date, entries]) => {
      entries.forEach(entry => {
        flattenedData.push({ ...entry, date });
      });
    });
    
    return flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    const formattedDate = date || formatDate(new Date(), 'yyyy-MM-dd');
    const waterData = {
      glasses: glasses,
      goal: goal,
      time: formatDate(new Date(), 'HH:mm')
    };
    
    // Get existing water logs
    const waterLogsJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    let waterLogs = waterLogsJson ? JSON.parse(waterLogsJson) : {};
    
    // Update or create water log for this date
    waterLogs[formattedDate] = [waterData];
    
    // Save the updated data
    await AsyncStorage.setItem(storageKeys.WATER_LOGS, JSON.stringify(waterLogs));
    
    return waterData;
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
    const waterLogsJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    const waterLogs = waterLogsJson ? JSON.parse(waterLogsJson) : {};
    
    // Flatten the data and sort by date (newest first)
    const flattenedData = [];
    Object.entries(waterLogs).forEach(([date, entries]) => {
      if (entries.length > 0) {
        flattenedData.push({ ...entries[0], date });
      }
    });
    
    return flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    // Get all logs
    const foodLogsJson = await AsyncStorage.getItem(storageKeys.FOOD_LOGS);
    const moodLogsJson = await AsyncStorage.getItem(storageKeys.MOOD_LOGS);
    const exerciseLogsJson = await AsyncStorage.getItem(storageKeys.EXERCISE_LOGS);
    const sleepLogsJson = await AsyncStorage.getItem(storageKeys.SLEEP_LOGS);
    const waterLogsJson = await AsyncStorage.getItem(storageKeys.WATER_LOGS);
    
    // Parse logs
    const foodLogs = foodLogsJson ? JSON.parse(foodLogsJson) : {};
    const moodLogs = moodLogsJson ? JSON.parse(moodLogsJson) : {};
    const exerciseLogs = exerciseLogsJson ? JSON.parse(exerciseLogsJson) : {};
    const sleepLogs = sleepLogsJson ? JSON.parse(sleepLogsJson) : {};
    const waterLogs = waterLogsJson ? JSON.parse(waterLogsJson) : {};
    
    // Get all dates with logged data
    const allDates = new Set([
      ...Object.keys(foodLogs),
      ...Object.keys(moodLogs),
      ...Object.keys(exerciseLogs),
      ...Object.keys(sleepLogs),
      ...Object.keys(waterLogs)
    ]);
    
    // Count total logs
    let logsCount = 0;
    Object.values(foodLogs).forEach(logs => { logsCount += logs.length; });
    Object.values(moodLogs).forEach(logs => { logsCount += logs.length; });
    Object.values(exerciseLogs).forEach(logs => { logsCount += logs.length; });
    Object.values(sleepLogs).forEach(logs => { logsCount += logs.length; });
    Object.values(waterLogs).forEach(logs => { logsCount += logs.length; });
    
    // Calculate streak (simplified)
    // For a real app, this would be more sophisticated
    let streak = 0;
    const today = formatDate(new Date(), 'yyyy-MM-dd');
    const yesterday = formatDate(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
    if (hasAnyLog(today, foodLogs, moodLogs, exerciseLogs, sleepLogs, waterLogs)) {
      streak = 1;
      
      // Check previous days
      let currentDate = new Date(Date.parse(yesterday));
      while (true) {
        const dateStr = formatDate(currentDate, 'yyyy-MM-dd');
        if (hasAnyLog(dateStr, foodLogs, moodLogs, exerciseLogs, sleepLogs, waterLogs)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    return {
      daysActive: allDates.size,
      logsCount,
      streak
    };
  } catch (error) {
    console.error('Error getting profile stats:', error);
    return { daysActive: 0, logsCount: 0, streak: 0 };
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
const hasAnyLog = (date, foodLogs, moodLogs, exerciseLogs, sleepLogs, waterLogs) => {
  return (
    (foodLogs[date] && foodLogs[date].length > 0) ||
    (moodLogs[date] && moodLogs[date].length > 0) ||
    (exerciseLogs[date] && exerciseLogs[date].length > 0) ||
    (sleepLogs[date] && sleepLogs[date].length > 0) ||
    (waterLogs[date] && waterLogs[date].length > 0)
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
  if (!reminder || !reminder.title || !reminder.type) {
    throw new Error('Reminder must have a title and type');
  }
  
  try {
    // Get existing reminders
    const remindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Create new reminder with defaults
    const newReminder = {
      id: Date.now().toString(),
      title: reminder.title,
      type: reminder.type,
      time: reminder.time || '09:00 AM',
      enabled: reminder.enabled !== false,
      frequency: reminder.frequency || 'daily',
      description: reminder.description || '',
      ...reminder
    };
    
    // Schedule the notification if enabled
    if (newReminder.enabled) {
      newReminder.notificationId = await scheduleReminder(newReminder);
    }
    
    // Add to reminders array
    reminders.push(newReminder);
    
    // Save updated reminders
    await AsyncStorage.setItem(storageKeys.REMINDERS, JSON.stringify(reminders));
    
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
  if (!id) throw new Error('Reminder ID is required');
  
  try {
    // Get existing reminders
    const remindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Find the reminder to update
    const reminderIndex = reminders.findIndex(r => r.id === id);
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    const oldReminder = reminders[reminderIndex];
    const updatedReminder = { ...oldReminder, ...updates };
    
    // Cancel old notification if it exists
    if (oldReminder.notificationId) {
      await cancelNotification(oldReminder.notificationId);
    }
    
    // Schedule new notification if enabled
    if (updatedReminder.enabled) {
      updatedReminder.notificationId = await scheduleReminder(updatedReminder);
    } else {
      updatedReminder.notificationId = null;
    }
    
    // Update reminders array
    reminders[reminderIndex] = updatedReminder;
    
    // Save updated reminders
    await AsyncStorage.setItem(storageKeys.REMINDERS, JSON.stringify(reminders));
    
    return updatedReminder;
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
  if (!id) throw new Error('Reminder ID is required');
  
  try {
    // Get existing reminders
    const remindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Find the reminder to delete
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) {
      // Reminder not found, nothing to do
      return;
    }
    
    // Cancel notification if it exists
    if (reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    
    // Filter out the reminder
    const updatedReminders = reminders.filter(r => r.id !== id);
    
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
    return preferencesJson ? JSON.parse(preferencesJson) : {
      notifications: true,
      privacyMode: false,
      theme: 'system',
      waterGoal: DEFAULT_VALUES.WATER_GOAL,
      sleepGoal: DEFAULT_VALUES.SLEEP_GOAL
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      notifications: true,
      privacyMode: false,
      theme: 'system',
      waterGoal: DEFAULT_VALUES.WATER_GOAL,
      sleepGoal: DEFAULT_VALUES.SLEEP_GOAL
    };
  }
};

/**
 * Update user preferences
 * @param {Object} preferences Updated preferences
 * @returns {Object} Updated preferences
 */
export const updateUserPreferences = async (preferences) => {
  if (!preferences) throw new Error('Preferences object is required');
  
  try {
    // Get existing preferences
    const preferencesJson = await AsyncStorage.getItem(storageKeys.PREFERENCES);
    const existingPreferences = preferencesJson ? JSON.parse(preferencesJson) : {};
    
    // Merge with new preferences
    const updatedPreferences = { ...existingPreferences, ...preferences };
    
    // Save updated preferences
    await AsyncStorage.setItem(storageKeys.PREFERENCES, JSON.stringify(updatedPreferences));
    
    return updatedPreferences;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Clear all user data
 */
export const clearAllData = async () => {
  try {
    // Get reminders to cancel notifications
    const remindersJson = await AsyncStorage.getItem(storageKeys.REMINDERS);
    const reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Cancel all notifications
    for (const reminder of reminders) {
      if (reminder.notificationId) {
        await cancelNotification(reminder.notificationId);
      }
    }
    
    // Clear all log data
    await AsyncStorage.removeItem(storageKeys.FOOD_LOGS);
    await AsyncStorage.removeItem(storageKeys.MOOD_LOGS);
    await AsyncStorage.removeItem(storageKeys.EXERCISE_LOGS);
    await AsyncStorage.removeItem(storageKeys.SLEEP_LOGS);
    await AsyncStorage.removeItem(storageKeys.WATER_LOGS);
    await AsyncStorage.removeItem(storageKeys.REMINDERS);
    
    // Keep user and preferences
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export default {
  storageKeys,
  getUserData,
  getHistoricalData,
  logFood,
  getFoodHistory,
  logMood,
  getMoodHistory,
  logExercise,
  getExerciseHistory,
  logSleep,
  getSleepHistory,
  updateWaterIntake,
  getWaterHistory,
  getProfileStats,
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
  getUserPreferences,
  updateUserPreferences,
  clearAllData
};
