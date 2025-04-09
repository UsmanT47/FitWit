import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { localAuthApi } from '../api/authApi';

// Create the auth context
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateUser: () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        setIsLoading(true);
        
        // Load token from storage
        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (savedToken) {
          setToken(savedToken);
          
          // Load user data from storage
          const savedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
          
          if (savedUserData) {
            setUser(JSON.parse(savedUserData));
          } else {
            // If we have a token but no user data, clear token (inconsistent state)
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        // If there's an error, clear auth state to be safe
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.AUTH_TOKEN,
          STORAGE_KEYS.USER_DATA,
        ]);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthState();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Call login API
      const response = await localAuthApi.login(credentials);
      
      // Save token and user data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Call register API
      const response = await localAuthApi.register(userData);
      
      // Save token and user data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API if we have a token
      if (token) {
        try {
          await localAuthApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API call fails
        }
      }
      
      // Clear auth state from storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      
      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user data
  const updateUser = async (updatedUserData) => {
    try {
      // In a real app, you would call an API to update the user data
      // For now, we'll just update local storage
      
      // Get current user data
      const currentUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const currentUser = currentUserData ? JSON.parse(currentUserData) : {};
      
      // Merge with updated data
      const newUserData = { ...currentUser, ...updatedUserData };
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUserData));
      
      // Update state
      setUser(newUserData);
      
      return newUserData;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };
  
  // Context value
  const contextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;