import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { FEATURES } from '../constants/config';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Register for push notifications
 * @returns {Boolean} true if permission was granted
 */
export const registerNotifications = async () => {
  if (!FEATURES.ENABLE_PUSH_NOTIFICATIONS) {
    return false;
  }
  
  try {
    // Check if we already have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // If we don't have permission yet, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // If we still don't have permission, we can't send notifications
    if (finalStatus !== 'granted') {
      return false;
    }
    
    // Get the token for this device
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#009688',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Request notification permissions
 * @returns {Boolean} true if permission was granted
 */
export const requestNotificationPermissions = async () => {
  if (!FEATURES.ENABLE_PUSH_NOTIFICATIONS) {
    return false;
  }
  
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a local notification
 * @param {Object} options Notification options
 * @param {String} options.title Notification title
 * @param {String} options.body Notification body
 * @param {Object} options.data Additional data to include with the notification
 * @param {Date} options.trigger When to send the notification
 * @returns {String} Notification identifier
 */
export const scheduleNotification = async ({ title, body, data = {}, trigger }) => {
  if (!FEATURES.ENABLE_PUSH_NOTIFICATIONS) {
    return null;
  }
  
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/**
 * Schedule a daily reminder notification
 * @param {Object} options Reminder options
 * @param {String} options.title Notification title
 * @param {String} options.body Notification body
 * @param {Object} options.data Additional data to include with the notification
 * @param {Number} options.hour Hour to send the notification (0-23)
 * @param {Number} options.minute Minute to send the notification (0-59)
 * @returns {String} Notification identifier
 */
export const scheduleDailyReminder = async ({ title, body, data = {}, hour, minute }) => {
  return scheduleNotification({
    title,
    body,
    data,
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

/**
 * Schedule a reminder for a specific time
 * @param {Object} reminder Reminder object
 * @returns {String} Notification identifier
 */
export const scheduleReminder = async (reminder) => {
  if (!reminder || !reminder.title || !reminder.time) {
    return null;
  }
  
  try {
    // Parse time string (format: "HH:MM" or "HH:MM AM/PM")
    let hour = 0;
    let minute = 0;
    
    if (typeof reminder.time === 'string') {
      const timeParts = reminder.time.match(/(\d+):(\d+)(?:\s*([AP]M))?/i);
      
      if (timeParts) {
        hour = parseInt(timeParts[1], 10);
        minute = parseInt(timeParts[2], 10);
        
        // Handle AM/PM
        const period = timeParts[3]?.toUpperCase();
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
      }
    }
    
    return scheduleDailyReminder({
      title: reminder.title,
      body: reminder.description || `Time to ${reminder.title.toLowerCase()}!`,
      data: { type: reminder.type, id: reminder.id },
      hour,
      minute,
    });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return null;
  }
};

/**
 * Cancel a specific notification
 * @param {String} notificationId Notification identifier
 */
export const cancelNotification = async (notificationId) => {
  if (!notificationId) return;
  
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 * @returns {Array} Array of scheduled notifications
 */
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

export default {
  registerNotifications,
  requestNotificationPermissions,
  scheduleNotification,
  scheduleDailyReminder,
  scheduleReminder,
  cancelNotification,
  cancelAllNotifications,
  getAllScheduledNotifications,
};
