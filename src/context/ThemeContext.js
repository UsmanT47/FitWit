import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/colors';

export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
};

const ThemeContext = createContext({
  theme: lightTheme,
  themeMode: THEME_MODE.LIGHT,
  isDarkMode: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(THEME_MODE.LIGHT);
  const [theme, setTheme] = useState(lightTheme);
  const isDarkMode = themeMode === THEME_MODE.DARK;

  useEffect(() => {
    // Load saved theme preference from storage
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          handleThemeChange(savedThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    setTheme(mode === THEME_MODE.DARK ? darkTheme : lightTheme);
    
    // Save theme preference to storage
    try {
      AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    handleThemeChange(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDarkMode,
        toggleTheme,
        setThemeMode: handleThemeChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};