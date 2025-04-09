import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Import theme constants
import { lightTheme, darkTheme } from '../constants/colors';
import { STORAGE_KEYS, THEMES } from '../constants/config';

// Create theme context
const ThemeContext = createContext();

/**
 * Theme provider component
 * Handles theme management and persistence
 */
export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  
  // Initial theme state
  const [themeMode, setThemeMode] = useState(THEMES.SYSTEM);
  const [theme, setTheme] = useState(deviceColorScheme === 'dark' ? darkTheme : lightTheme);
  
  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
        
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
          
          // Apply the saved theme
          if (savedThemeMode === THEMES.DARK) {
            setTheme(darkTheme);
          } else if (savedThemeMode === THEMES.LIGHT) {
            setTheme(lightTheme);
          } else {
            // For 'system', use device theme
            setTheme(deviceColorScheme === 'dark' ? darkTheme : lightTheme);
          }
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };
    
    loadThemeMode();
  }, [deviceColorScheme]);
  
  // Handle theme mode changes
  const handleSetThemeMode = async (mode) => {
    try {
      // Save theme mode to storage
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      
      // Update state
      setThemeMode(mode);
      
      // Apply the new theme
      if (mode === THEMES.DARK) {
        setTheme(darkTheme);
      } else if (mode === THEMES.LIGHT) {
        setTheme(lightTheme);
      } else {
        // For 'system', use device theme
        setTheme(deviceColorScheme === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };
  
  // Determine if dark mode is active
  const isDarkMode = 
    themeMode === THEMES.DARK || 
    (themeMode === THEMES.SYSTEM && deviceColorScheme === 'dark');
  
  // Context value
  const contextValue = {
    theme,
    themeMode,
    setThemeMode: handleSetThemeMode,
    isDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
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