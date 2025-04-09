import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuthApi } from '../api/authApi';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await localAuthApi.login(credentials);
      
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await localAuthApi.register(userData);
      
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await localAuthApi.logout();
      
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message || 'Logout failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      // Here we would typically call an API endpoint to update the profile
      // For now, we'll just update the local state and storage
      
      const updatedUser = { ...user, ...profileData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message || 'Profile update failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};