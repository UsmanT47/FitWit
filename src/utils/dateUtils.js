/**
 * Date and time utility functions
 */

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date as Month D, YYYY (e.g., January 1, 2023)
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Format a time as HH:MM AM/PM
 * @param {Date} date - Date to extract time from
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;
  return `${twelveHour}:${minutes} ${ampm}`;
};

/**
 * Format a date and time
 * @param {Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return `${formatDisplayDate(date)} at ${formatTime(date)}`;
};

/**
 * Get the start of a day
 * @param {Date} date - Date to get the start of day for
 * @returns {Date} Start of day
 */
export const startOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a day
 * @param {Date} date - Date to get the end of day for
 * @returns {Date} End of day
 */
export const endOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get the start of a week (Sunday)
 * @param {Date} date - Date to get the start of week for
 * @returns {Date} Start of week
 */
export const startOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day;
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a week (Saturday)
 * @param {Date} date - Date to get the end of week for
 * @returns {Date} End of week
 */
export const endOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() + (6 - day);
  newDate.setDate(diff);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get the start of a month
 * @param {Date} date - Date to get the start of month for
 * @returns {Date} Start of month
 */
export const startOfMonth = (date) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a month
 * @param {Date} date - Date to get the end of month for
 * @returns {Date} End of month
 */
export const endOfMonth = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(0);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get an array of the past n days
 * @param {number} n - Number of days to go back
 * @returns {Array<Date>} Array of dates
 */
export const getPastDays = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
};

/**
 * Get a human-readable relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? 'last month' : `${diffMonths} months ago`;
  } else {
    return diffYears === 1 ? 'last year' : `${diffYears} years ago`;
  }
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} Whether the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param {Date} date - Date to check
 * @returns {boolean} Whether the date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get the days of the week
 * @returns {Array<string>} Array of day names
 */
export const getDaysOfWeek = () => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

/**
 * Get the days of the week (abbreviated)
 * @returns {Array<string>} Array of abbreviated day names
 */
export const getDaysOfWeekShort = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * Get the months of the year
 * @returns {Array<string>} Array of month names
 */
export const getMonthsOfYear = () => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
};

/**
 * Get the months of the year (abbreviated)
 * @returns {Array<string>} Array of abbreviated month names
 */
export const getMonthsOfYearShort = () => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
};