/**
 * Validate an email address
 * @param {String} email The email to validate
 * @returns {Boolean} True if the email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  // Basic email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password
 * @param {String} password The password to validate
 * @param {Object} options Validation options
 * @param {Number} options.minLength Minimum length (default: 6)
 * @param {Boolean} options.requireNumber Require at least one number (default: false)
 * @param {Boolean} options.requireSpecial Require at least one special character (default: false)
 * @returns {Object} Validation result { isValid, message }
 */
export const validatePassword = (password, options = {}) => {
  const minLength = options.minLength || 6;
  const requireNumber = options.requireNumber || false;
  const requireSpecial = options.requireSpecial || false;
  
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters` };
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate that a value is a number within a specified range
 * @param {*} value The value to validate
 * @param {Object} options Validation options
 * @param {Number} options.min Minimum value (optional)
 * @param {Number} options.max Maximum value (optional)
 * @returns {Object} Validation result { isValid, message }
 */
export const validateNumber = (value, options = {}) => {
  const min = options.min !== undefined ? options.min : -Infinity;
  const max = options.max !== undefined ? options.max : Infinity;
  
  // Convert string to number if needed
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, message: 'Value must be a number' };
  }
  
  if (num < min) {
    return { isValid: false, message: `Value must be at least ${min}` };
  }
  
  if (num > max) {
    return { isValid: false, message: `Value must be at most ${max}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate that a string is not empty
 * @param {String} value The string to validate
 * @param {String} fieldName Name of the field (for error message)
 * @returns {Object} Validation result { isValid, message }
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate that a string is within a specified length range
 * @param {String} value The string to validate
 * @param {Object} options Validation options
 * @param {Number} options.minLength Minimum length (optional)
 * @param {Number} options.maxLength Maximum length (optional)
 * @param {String} options.fieldName Name of the field (for error message)
 * @returns {Object} Validation result { isValid, message }
 */
export const validateLength = (value, options = {}) => {
  const minLength = options.minLength !== undefined ? options.minLength : 0;
  const maxLength = options.maxLength !== undefined ? options.maxLength : Infinity;
  const fieldName = options.fieldName || 'Field';
  
  if (typeof value !== 'string') {
    return { isValid: false, message: `${fieldName} must be a string` };
  }
  
  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName} must be no more than ${maxLength} characters` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate a date
 * @param {Date|String} date The date to validate
 * @param {Object} options Validation options
 * @param {Date|String} options.minDate Minimum date (optional)
 * @param {Date|String} options.maxDate Maximum date (optional)
 * @returns {Object} Validation result { isValid, message }
 */
export const validateDate = (date, options = {}) => {
  const minDate = options.minDate ? new Date(options.minDate) : null;
  const maxDate = options.maxDate ? new Date(options.maxDate) : null;
  
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Invalid date' };
  }
  
  if (minDate && dateObj < minDate) {
    return { isValid: false, message: 'Date is too early' };
  }
  
  if (maxDate && dateObj > maxDate) {
    return { isValid: false, message: 'Date is too late' };
  }
  
  return { isValid: true, message: '' };
};

export default {
  validateEmail,
  validatePassword,
  validateNumber,
  validateRequired,
  validateLength,
  validateDate
};
