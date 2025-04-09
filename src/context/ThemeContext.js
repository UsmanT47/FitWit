import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/colors';
import { storageKeys } from '../services/storageService';

// Create theme context
const ThemeContext = createContext();

// Theme options
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(THEME_MODE.SYSTEM);
  const [loading, setLoading] = useState(true);
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(storageKeys.THEME_MODE);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Determine active theme based on mode and device preference
  const getActiveTheme = () => {
    if (themeMode === THEME_MODE.SYSTEM) {
      return deviceTheme === 'dark' ? darkTheme : lightTheme;
    }
    
    return themeMode === THEME_MODE.DARK ? darkTheme : lightTheme;
  };
  
  // Set theme mode and save to storage
  const setTheme = async (mode) => {
    try {
      await AsyncStorage.setItem(storageKeys.THEME_MODE, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Check if dark mode is active
  const isDarkMode = () => {
    if (themeMode === THEME_MODE.SYSTEM) {
      return deviceTheme === 'dark';
    }
    
    return themeMode === THEME_MODE.DARK;
  };
  
  // Theme context value
  const contextValue = {
    theme: getActiveTheme(),
    themeMode,
    isDarkMode: isDarkMode(),
    setTheme,
    loading,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
