import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/colors';
import { THEMES, STORAGE_KEYS } from '../constants/config';

// Create the context
const ThemeContext = createContext();

/**
 * Theme provider component
 * Handles theme management and persistence
 */
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(THEMES.SYSTEM);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine the actual theme based on the mode and device theme
  const isDarkMode = 
    themeMode === THEMES.SYSTEM 
      ? deviceTheme === 'dark'
      : themeMode === THEMES.DARK;
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Load the saved theme mode on initial render
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save the theme mode whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
    
    if (!isLoading) {
      saveTheme();
    }
  }, [themeMode, isLoading]);
  
  const value = {
    theme,
    isDarkMode,
    themeMode,
    setThemeMode,
    isLoading,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook for using the theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};