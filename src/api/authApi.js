// Simulated API for authentication
// In a real app, this would call a backend API

// Mock user database
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    height: 175,
    weight: 70,
    gender: 'male',
    birthdate: '1990-01-01',
    fitnessGoal: 'weightLoss',
    activityLevel: 'moderate',
    preferences: {
      notifications: true,
      darkMode: false,
      units: 'metric',
    },
  },
];

/**
 * Register a new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Response with token and user data
 */
export const registerUser = async (userData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: String(users.length + 1),
      ...userData,
      preferences: {
        notifications: true,
        darkMode: false,
        units: 'metric',
      },
    };
    
    // Remove password from returned user object
    const { password, ...userWithoutPassword } = newUser;
    
    // Add user to "database"
    users.push(newUser);
    
    return {
      token: `mock-token-${newUser.id}`,
      user: userWithoutPassword,
    };
  } catch (error) {
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const user = users.find(u => u.email === credentials.email);
    
    // Check if user exists and password matches
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    
    // Remove password from returned user object
    const { password, ...userWithoutPassword } = user;
    
    return {
      token: `mock-token-${user.id}`,
      user: userWithoutPassword,
    };
  } catch (error) {
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would validate the refresh token and generate a new access token
    // For this mock, we'll just return a new token
    
    return {
      token: `mock-token-refreshed-${Date.now()}`,
    };
  } catch (error) {
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we might invalidate the token on the server
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    throw error;
  }
};

// Local API interface
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