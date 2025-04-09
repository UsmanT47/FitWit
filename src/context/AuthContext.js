import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuthApi } from '../api/authApi';
import { storageKeys } from '../services/storageService';

// Create auth context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(storageKeys.USER);
        const storedToken = await AsyncStorage.getItem(storageKeys.TOKEN);
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await localAuthApi.register(userData);
      
      if (response.user && response.token) {
        await AsyncStorage.setItem(storageKeys.USER, JSON.stringify(response.user));
        await AsyncStorage.setItem(storageKeys.TOKEN, response.token);
        
        setUser(response.user);
        setToken(response.token);
        return { success: true };
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await localAuthApi.login(credentials);
      
      if (response.user && response.token) {
        await AsyncStorage.setItem(storageKeys.USER, JSON.stringify(response.user));
        await AsyncStorage.setItem(storageKeys.TOKEN, response.token);
        
        setUser(response.user);
        setToken(response.token);
        return { success: true };
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    setLoading(true);
    
    try {
      await localAuthApi.logout();
      
      // Clear storage and state
      await AsyncStorage.removeItem(storageKeys.USER);
      await AsyncStorage.removeItem(storageKeys.TOKEN);
      
      setUser(null);
      setToken(null);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Logout failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, we would call an API here
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...userData };
      
      await AsyncStorage.setItem(storageKeys.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Profile update failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
