/**
 * Storage service for persisting and retrieving data locally
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Save health data to AsyncStorage
 * @param {Object} data - Health data to save
 * @returns {Promise<void>}
 */
export const saveHealthData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HEALTH_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving health data:', error);
    throw error;
  }
};

/**
 * Get health data from AsyncStorage
 * @returns {Promise<Object>} Health data
 */
export const getHealthData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting health data:', error);
    return null;
  }
};

/**
 * Save food logs to AsyncStorage
 * @param {Array} logs - Food logs to save
 * @returns {Promise<void>}
 */
export const saveFoodLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving food logs:', error);
    throw error;
  }
};

/**
 * Get food logs from AsyncStorage
 * @returns {Promise<Array>} Food logs
 */
export const getFoodLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting food logs:', error);
    return [];
  }
};

/**
 * Add a food log
 * @param {Object} log - Food log to add
 * @returns {Promise<Object>} Added food log with ID
 */
export const addFoodLog = async (log) => {
  try {
    const logs = await getFoodLogs();
    const newLog = {
      ...log,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    await saveFoodLogs(logs);
    return newLog;
  } catch (error) {
    console.error('Error adding food log:', error);
    throw error;
  }
};

/**
 * Update a food log
 * @param {string} id - ID of food log to update
 * @param {Object} data - New food log data
 * @returns {Promise<Object>} Updated food log
 */
export const updateFoodLog = async (id, data) => {
  try {
    const logs = await getFoodLogs();
    const index = logs.findIndex((log) => log.id === id);
    
    if (index === -1) {
      throw new Error('Food log not found');
    }
    
    const updatedLog = {
      ...logs[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    logs[index] = updatedLog;
    await saveFoodLogs(logs);
    
    return updatedLog;
  } catch (error) {
    console.error('Error updating food log:', error);
    throw error;
  }
};

/**
 * Delete a food log
 * @param {string} id - ID of food log to delete
 * @returns {Promise<void>}
 */
export const deleteFoodLog = async (id) => {
  try {
    const logs = await getFoodLogs();
    const filteredLogs = logs.filter((log) => log.id !== id);
    await saveFoodLogs(filteredLogs);
  } catch (error) {
    console.error('Error deleting food log:', error);
    throw error;
  }
};

/**
 * Save water logs to AsyncStorage
 * @param {Array} logs - Water logs to save
 * @returns {Promise<void>}
 */
export const saveWaterLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving water logs:', error);
    throw error;
  }
};

/**
 * Get water logs from AsyncStorage
 * @returns {Promise<Array>} Water logs
 */
export const getWaterLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.WATER_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting water logs:', error);
    return [];
  }
};

/**
 * Add a water log
 * @param {Object} log - Water log to add
 * @returns {Promise<Object>} Added water log with ID
 */
export const addWaterLog = async (log) => {
  try {
    const logs = await getWaterLogs();
    const newLog = {
      ...log,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    await saveWaterLogs(logs);
    return newLog;
  } catch (error) {
    console.error('Error adding water log:', error);
    throw error;
  }
};

/**
 * Save exercise logs to AsyncStorage
 * @param {Array} logs - Exercise logs to save
 * @returns {Promise<void>}
 */
export const saveExerciseLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving exercise logs:', error);
    throw error;
  }
};

/**
 * Get exercise logs from AsyncStorage
 * @returns {Promise<Array>} Exercise logs
 */
export const getExerciseLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting exercise logs:', error);
    return [];
  }
};

/**
 * Add an exercise log
 * @param {Object} log - Exercise log to add
 * @returns {Promise<Object>} Added exercise log with ID
 */
export const addExerciseLog = async (log) => {
  try {
    const logs = await getExerciseLogs();
    const newLog = {
      ...log,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    await saveExerciseLogs(logs);
    return newLog;
  } catch (error) {
    console.error('Error adding exercise log:', error);
    throw error;
  }
};

/**
 * Save sleep logs to AsyncStorage
 * @param {Array} logs - Sleep logs to save
 * @returns {Promise<void>}
 */
export const saveSleepLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving sleep logs:', error);
    throw error;
  }
};

/**
 * Get sleep logs from AsyncStorage
 * @returns {Promise<Array>} Sleep logs
 */
export const getSleepLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting sleep logs:', error);
    return [];
  }
};

/**
 * Add a sleep log
 * @param {Object} log - Sleep log to add
 * @returns {Promise<Object>} Added sleep log with ID
 */
export const addSleepLog = async (log) => {
  try {
    const logs = await getSleepLogs();
    const newLog = {
      ...log,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    await saveSleepLogs(logs);
    return newLog;
  } catch (error) {
    console.error('Error adding sleep log:', error);
    throw error;
  }
};

/**
 * Save mood logs to AsyncStorage
 * @param {Array} logs - Mood logs to save
 * @returns {Promise<void>}
 */
export const saveMoodLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving mood logs:', error);
    throw error;
  }
};

/**
 * Get mood logs from AsyncStorage
 * @returns {Promise<Array>} Mood logs
 */
export const getMoodLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting mood logs:', error);
    return [];
  }
};

/**
 * Add a mood log
 * @param {Object} log - Mood log to add
 * @returns {Promise<Object>} Added mood log with ID
 */
export const addMoodLog = async (log) => {
  try {
    const logs = await getMoodLogs();
    const newLog = {
      ...log,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    logs.push(newLog);
    await saveMoodLogs(logs);
    return newLog;
  } catch (error) {
    console.error('Error adding mood log:', error);
    throw error;
  }
};

/**
 * Save reminders to AsyncStorage
 * @param {Array} reminders - Reminders to save
 * @returns {Promise<void>}
 */
export const saveReminders = async (reminders) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
    throw error;
  }
};

/**
 * Get reminders from AsyncStorage
 * @returns {Promise<Array>} Reminders
 */
export const getReminders = async () => {
  try {
    const reminders = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    return reminders ? JSON.parse(reminders) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

/**
 * Add a reminder
 * @param {Object} reminder - Reminder to add
 * @returns {Promise<Object>} Added reminder with ID
 */
export const addReminder = async (reminder) => {
  try {
    const reminders = await getReminders();
    const newReminder = {
      ...reminder,
      id: Date.now().toString(), // Simple ID for local storage
      createdAt: new Date().toISOString(),
    };
    reminders.push(newReminder);
    await saveReminders(reminders);
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

/**
 * Delete a reminder
 * @param {string} id - ID of reminder to delete
 * @returns {Promise<void>}
 */
export const deleteReminder = async (id) => {
  try {
    const reminders = await getReminders();
    const filteredReminders = reminders.filter((reminder) => reminder.id !== id);
    await saveReminders(filteredReminders);
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

/**
 * Save user preferences to AsyncStorage
 * @param {Object} preferences - User preferences to save
 * @returns {Promise<void>}
 */
export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

/**
 * Get user preferences from AsyncStorage
 * @returns {Promise<Object>} User preferences
 */
export const getUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

/**
 * Save last sync time to AsyncStorage
 * @param {string} timestamp - ISO timestamp of last sync
 * @returns {Promise<void>}
 */
export const saveLastSync = async (timestamp) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
  } catch (error) {
    console.error('Error saving last sync time:', error);
    throw error;
  }
};

/**
 * Get last sync time from AsyncStorage
 * @returns {Promise<string|null>} ISO timestamp of last sync or null
 */
export const getLastSync = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};

/**
 * Clear all app data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  try {
    // Only clear data, not authentication
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HEALTH_DATA,
      STORAGE_KEYS.FOOD_LOGS,
      STORAGE_KEYS.WATER_LOGS,
      STORAGE_KEYS.EXERCISE_LOGS,
      STORAGE_KEYS.SLEEP_LOGS,
      STORAGE_KEYS.MOOD_LOGS,
      STORAGE_KEYS.REMINDERS,
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.LAST_SYNC,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * Get all user data for insights and analysis
 * @returns {Promise<Object>} All user data
 */
export const getUserData = async () => {
  try {
    const [food, water, exercise, sleep, mood, healthData, preferences] = await Promise.all([
      getFoodLogs(),
      getWaterLogs(),
      getExerciseLogs(),
      getSleepLogs(),
      getMoodLogs(),
      getHealthData(),
      getUserPreferences(),
    ]);
    
    return {
      food,
      water,
      exercise,
      sleep,
      mood,
      healthData,
      preferences,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};