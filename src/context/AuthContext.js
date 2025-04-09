import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import auth API
import { localAuthApi } from '../api/authApi';

// Import constants
import { STORAGE_KEYS } from '../constants/config';

// Create auth context
const AuthContext = createContext();

/**
 * Auth provider component
 * Handles user authentication state and persistence
 */
export const AuthProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load user data from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Load user data and token from storage
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const authToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (userData && authToken) {
          setUser(JSON.parse(userData));
          setToken(authToken);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  /**
   * Register a new user
   * @param {Object} userData User registration data
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call registration API
      // In a real app, this would make an API request
      // For now, we'll use a local implementation
      const response = await localAuthApi.register(userData);
      
      // Save user data and token to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      // Update state
      setUser(response.user);
      setToken(response.token);
      
      return response;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Log in an existing user
   * @param {Object} credentials User credentials (username, password)
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call login API
      // In a real app, this would make an API request
      // For now, we'll use a local implementation
      const response = await localAuthApi.login(credentials);
      
      // Save user data and token to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      
      // Update state
      setUser(response.user);
      setToken(response.token);
      
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      // In a real app, this would make an API request
      // For now, we'll use a local implementation
      await localAuthApi.logout();
      
      // Clear auth storage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      // Reset state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update user profile data
   * @param {Object} userData Updated user data
   */
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      
      // In a real app, this would make an API request
      // For now, we'll just update local storage
      const updatedUser = { ...user, ...userData };
      
      // Save updated user data to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const contextValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
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