import { API_URL, ERROR_MESSAGES } from '../constants/config';

/**
 * Register a new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Response with token and user data
 */
export const registerUser = async (userData) => {
  try {
    // In a real implementation, this would make an API call
    console.log('Registering user:', userData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response
    return {
      user: {
        id: 1,
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString(),
      },
      token: 'mock-token-' + Date.now(),
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
  }
};

/**
 * Login user
 * @param {Object} credentials User login credentials (email, password)
 * @returns {Promise<Object>} Response with token and user data
 */
export const loginUser = async (credentials) => {
  try {
    // In a real implementation, this would make an API call
    console.log('Logging in user:', credentials.email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: 1,
          name: 'Test User',
          email: credentials.email,
          createdAt: new Date().toISOString(),
        },
        token: 'mock-token-' + Date.now(),
      };
    }
    
    // Simulate successful login for any credentials (for demo purposes)
    return {
      user: {
        id: 1,
        name: 'Demo User',
        email: credentials.email,
        createdAt: new Date().toISOString(),
      },
      token: 'mock-token-' + Date.now(),
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
  }
};

/**
 * Refresh auth token
 * @param {String} refreshToken Refresh token
 * @returns {Promise<Object>} Response with new access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    // In a real implementation, this would make an API call
    console.log('Refreshing token');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response
    return {
      token: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
  }
};

/**
 * Logout user
 * @param {String} token Access token
 * @returns {Promise<Object>} Response with success message
 */
export const logoutUser = async (token) => {
  try {
    // In a real implementation, this would make an API call
    console.log('Logging out user');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      success: true,
      message: 'Successfully logged out',
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.message || ERROR_MESSAGES.UNKNOWN);
  }
};

export const localAuthApi = {
  async register(userData) {
    return registerUser(userData);
  },
  
  async login(credentials) {
    return loginUser(credentials);
  },
  
  async logout() {
    return logoutUser();
  },
};