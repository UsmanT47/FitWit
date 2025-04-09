import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { registerUser, loginUser, logoutUser } from '../api/authApi';

// Create the context
const AuthContext = createContext();

/**
 * Auth provider component
 * Handles user authentication state and persistence
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for saved authentication on initial render
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const authToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (userData && authToken) {
          setUser(JSON.parse(userData));
          setToken(authToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load authentication data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuth();
  }, []);
  
  /**
   * Register a new user
   * @param {Object} userData User registration data
   */
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      
      // Save auth data to state
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      
      // Save auth data to persistent storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Log in an existing user
   * @param {Object} credentials User credentials (username, password)
   */
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      
      // Save auth data to state
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      
      // Save auth data to persistent storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
      
      // Clear auth data from state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Clear auth data from persistent storage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  /**
   * Update user profile data
   * @param {Object} userData Updated user data
   */
  const updateProfile = async (userData) => {
    try {
      // In a real app, make an API call to update the profile
      const updatedUser = { ...user, ...userData };
      
      // Update state
      setUser(updatedUser);
      
      // Update persistent storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };
  
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for using the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};