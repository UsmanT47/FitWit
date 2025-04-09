import { API_URL } from '../constants/config';

/**
 * Register a new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Response with token and user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials User login credentials (email, password)
 * @returns {Promise<Object>} Response with token and user data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * Refresh auth token
 * @param {String} refreshToken Refresh token
 * @returns {Promise<Object>} Response with new access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }
    
    return data;
  } catch (error) {
    console.error('Token refresh API error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @param {String} token Access token
 * @returns {Promise<Object>} Response with success message
 */
export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }
    
    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
};

// Local implementation for testing/development without backend
export const localAuthApi = {
  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validation
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }
    
    // Return mock response
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        username: userData.username,
        email: userData.email,
      }
    };
  },
  
  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validation
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required');
    }
    
    // For development, accept any credentials
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        username: credentials.username,
        email: 'user@example.com',
      }
    };
  },
  
  async logout() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return { message: 'Logged out successfully' };
  }
};