/**
 * Format a date object into a string
 * @param {Date} date Date object to format
 * @param {String} format Format string (e.g., 'yyyy-MM-dd')
 * @returns {String} Formatted date string
 */
export const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date) {
    date = new Date();
  }
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format time from a Date object
 * @param {Date} date Date object
 * @param {Boolean} includeSeconds Whether to include seconds
 * @returns {String} Formatted time string (e.g., '14:30' or '2:30 PM')
 */
export const formatTime = (date, use24Hour = false) => {
  if (!date) {
    date = new Date();
  }
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  if (use24Hour) {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  } else {
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${period}`;
  }
};

/**
 * Format a date as relative time (e.g., 'today', 'yesterday', '2 days ago')
 * @param {Date|String} date Date to format
 * @returns {String} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffDays = Math.round((today - dateDay) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  
  // For older dates, return formatted date
  return formatDate(date, 'MM/dd/yyyy');
};

/**
 * Parse time string to Date object
 * @param {String} timeString Time string (e.g., '14:30' or '2:30 PM')
 * @returns {Date} Date object
 */
export const parseTime = (timeString) => {
  const date = new Date();
  
  if (timeString.includes('AM') || timeString.includes('PM')) {
    // 12-hour format
    const [timePart, period] = timeString.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    date.setHours(hours, minutes, 0, 0);
  } else {
    // 24-hour format
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
  }
  
  return date;
};

/**
 * Calculate time difference in hours between two dates
 * @param {Date} startDate Start date
 * @param {Date} endDate End date
 * @returns {Number} Time difference in hours
 */
export const calculateTimeDifference = (startDate, endDate) => {
  if (typeof startDate === 'string') startDate = new Date(startDate);
  if (typeof endDate === 'string') endDate = new Date(endDate);
  
  const diffMs = endDate - startDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};

/**
 * Get the start and end dates for a specific time range
 * @param {String} range Time range ('week', 'month', 'year')
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRangeForPeriod = (range) => {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate;
  
  switch (range) {
    case 'week':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      break;
    case 'month':
      startDate = new Date(endDate);
      startDate.setDate(1);
      break;
    case 'year':
      startDate = new Date(endDate.getFullYear(), 0, 1);
      break;
    default:
      // Default to last 7 days
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
  }
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};