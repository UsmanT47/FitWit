/**
 * Format a date object into a string
 * @param {Date} date Date object to format
 * @param {String} format Format string (e.g., 'yyyy-MM-dd')
 * @returns {String} Formatted date string
 */
export const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  // Get date components
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const milliseconds = dateObj.getMilliseconds();
  
  // Get day of week (0-6, starting from Sunday)
  const dayOfWeek = dateObj.getDay();
  
  // Days of week names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Helper to pad numbers with leading zeros
  const pad = (num, size = 2) => String(num).padStart(size, '0');
  
  // AM/PM indicator
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // 12-hour format
  const hours12 = hours % 12 || 12;
  
  // Replace format tokens with date values
  return format
    .replace(/yyyy/g, year)
    .replace(/yy/g, String(year).slice(-2))
    .replace(/MMMM/g, monthNames[month - 1])
    .replace(/MMM/g, monthNamesShort[month - 1])
    .replace(/MM/g, pad(month))
    .replace(/M/g, month)
    .replace(/dd/g, pad(day))
    .replace(/d/g, day)
    .replace(/EEEE/g, dayNames[dayOfWeek])
    .replace(/EEE/g, dayNamesShort[dayOfWeek])
    .replace(/HH/g, pad(hours))
    .replace(/H/g, hours)
    .replace(/hh/g, pad(hours12))
    .replace(/h/g, hours12)
    .replace(/mm/g, pad(minutes))
    .replace(/m/g, minutes)
    .replace(/ss/g, pad(seconds))
    .replace(/s/g, seconds)
    .replace(/SSS/g, pad(milliseconds, 3))
    .replace(/a/g, ampm.toLowerCase())
    .replace(/aa/g, ampm);
};

/**
 * Format time from a Date object
 * @param {Date} date Date object
 * @param {Boolean} includeSeconds Whether to include seconds
 * @returns {String} Formatted time string (e.g., '14:30' or '2:30 PM')
 */
export const formatTime = (date, use24Hour = false) => {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  if (use24Hour) {
    return formatDate(dateObj, 'HH:mm');
  } else {
    return formatDate(dateObj, 'h:mm aa');
  }
};

/**
 * Format a date as relative time (e.g., 'today', 'yesterday', '2 days ago')
 * @param {Date|String} date Date to format
 * @returns {String} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Check if same day
  const isToday = dateObj.getDate() === now.getDate() &&
                  dateObj.getMonth() === now.getMonth() &&
                  dateObj.getFullYear() === now.getFullYear();
  
  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = dateObj.getDate() === yesterday.getDate() &&
                      dateObj.getMonth() === yesterday.getMonth() &&
                      dateObj.getFullYear() === yesterday.getFullYear();
  
  if (isToday) {
    if (diffHours === 0) {
      if (diffMinutes === 0) {
        return 'just now';
      }
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (isYesterday) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateObj, 'MMM d, yyyy');
  }
};

/**
 * Parse time string to Date object
 * @param {String} timeString Time string (e.g., '14:30' or '2:30 PM')
 * @returns {Date} Date object
 */
export const parseTime = (timeString) => {
  if (!timeString) return new Date();
  
  // Handle different time formats
  let hours = 0;
  let minutes = 0;
  
  // Format: "HH:MM" or "H:MM"
  const timeRegex = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i;
  const match = timeString.match(timeRegex);
  
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    
    // Handle AM/PM
    const period = match[3]?.toUpperCase();
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
  }
  
  // Create a new date with the parsed time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date;
};

/**
 * Calculate time difference in hours between two dates
 * @param {Date} startDate Start date
 * @param {Date} endDate End date
 * @returns {Number} Time difference in hours
 */
export const calculateTimeDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  // Ensure we're working with Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  // Handle cases where end time is before start time (e.g., sleeping past midnight)
  let diffMs = end - start;
  if (diffMs < 0) {
    // Assume end time is the next day
    diffMs += 24 * 60 * 60 * 1000;
  }
  
  return diffMs / (60 * 60 * 1000);
};

/**
 * Get the start and end dates for a specific time range
 * @param {String} range Time range ('week', 'month', 'year')
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRangeForPeriod = (range) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (range) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }
  
  return {
    startDate: formatDate(startDate, 'yyyy-MM-dd'),
    endDate: formatDate(endDate, 'yyyy-MM-dd')
  };
};

export default {
  formatDate,
  formatTime,
  formatRelativeTime,
  parseTime,
  calculateTimeDifference,
  getDateRangeForPeriod
};
