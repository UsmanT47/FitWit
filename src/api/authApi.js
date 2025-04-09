import axios from 'axios';
import { API_URL } from '../constants/config';

// Base URL for auth endpoints
const API_BASE_URL = `${API_URL}/auth`;

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Refresh token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout user
export const logoutUser = async (token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/logout`, 
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// For development - use local storage instead of API
export const localAuthApi = {
  async register(userData) {
    // Implementation will be provided by storageService
    return { user: { ...userData, id: Date.now().toString() }, token: 'dummy-token-' + Date.now() };
  },
  
  async login(credentials) {
    // Implementation will be provided by storageService
    return { user: { email: credentials.email, id: Date.now().toString() }, token: 'dummy-token-' + Date.now() };
  },
  
  async logout() {
    // Implementation will be provided by storageService
    return { success: true };
  }
};

// Helper to handle API errors
const handleApiError = (error) => {
  console.error('Auth API Error:', error.response?.data || error.message);
  
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Authentication error occurred',
      error: error.response.data
    };
  }
  
  return {
    status: 500,
    message: error.message || 'Network error occurred',
    error: error
  };
};
