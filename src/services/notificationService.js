import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Register for push notifications
 * @returns {Boolean} true if permission was granted
 */
export const registerNotifications = async () => {
  try {
    // Check if we're running on a physical device
    if (!Constants.isDevice) {
      console.log('Push notifications are not supported in the simulator');
      return false;
    }
    
    // Request permission to show notifications
    const hasPermission = await requestNotificationPermissions();
    
    if (!hasPermission) {
      console.log('Failed to get push token: Permission denied');
      return false;
    }
    
    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    return true;
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return false;
  }
};

/**
 * Request notification permissions
 * @returns {Boolean} true if permission was granted
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // If we don't have permission already, request it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
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
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger,
    });
    
    return identifier;
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
  try {
    const trigger = {
      hour,
      minute,
      repeats: true,
    };
    
    return await scheduleNotification({ title, body, data, trigger });
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return null;
  }
};

/**
 * Schedule a reminder for a specific time
 * @param {Object} reminder Reminder object
 * @returns {String} Notification identifier
 */
export const scheduleReminder = async (reminder) => {
  try {
    // Extract time components from reminder.time (format: 'HH:MM')
    const [hourStr, minuteStr] = reminder.time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Verify time components are valid
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('Invalid time format for reminder', reminder);
      return null;
    }
    
    // Schedule the reminder
    return await scheduleDailyReminder({
      title: reminder.title,
      body: `Time to ${reminder.type === 'water' ? 'drink water!' : `track your ${reminder.type}!`}`,
      data: { reminderId: reminder.id, type: reminder.type },
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