import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, STORAGE_KEYS } from '../constants/config';

// Light theme
const lightTheme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EFEFEF',
    accent: '#E1F5FE',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    accent: '#2196F3',
    inverted: '#FFFFFF',
  },
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrast: '#FFFFFF',
  },
  accent: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrast: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrast: '#FFFFFF',
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrast: '#FFFFFF',
  },
  divider: '#E0E0E0',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  statusBar: 'dark-content',
  mode: THEMES.LIGHT,
};

// Dark theme
const darkTheme = {
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
    accent: '#1A2733',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    tertiary: '#787878',
    accent: '#64B5F6',
    inverted: '#212121',
  },
  primary: {
    main: '#64B5F6',
    light: '#90CAF9',
    dark: '#2196F3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#FFB74D',
    light: '#FFCC80',
    dark: '#FF9800',
    contrast: '#FFFFFF',
  },
  accent: {
    main: '#81C784',
    light: '#A5D6A7',
    dark: '#4CAF50',
    contrast: '#FFFFFF',
  },
  error: {
    main: '#E57373',
    light: '#FFCDD2',
    dark: '#F44336',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#FFB74D',
    light: '#FFCC80',
    dark: '#FF9800',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#81C784',
    light: '#A5D6A7',
    dark: '#4CAF50',
    contrast: '#FFFFFF',
  },
  info: {
    main: '#64B5F6',
    light: '#90CAF9',
    dark: '#2196F3',
    contrast: '#FFFFFF',
  },
  divider: '#424242',
  border: '#424242',
  shadow: 'rgba(0, 0, 0, 0.3)',
  statusBar: 'light-content',
  mode: THEMES.DARK,
};

// Create theme context
const ThemeContext = createContext({
  theme: lightTheme,
  themeMode: THEMES.LIGHT,
  setThemeMode: () => {},
  isDarkMode: false,
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(THEMES.SYSTEM);
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.THEME, themeMode);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode]);
  
  // Determine current theme based on theme mode and system preference
  let activeTheme = lightTheme;
  let isDarkMode = false;
  
  switch (themeMode) {
    case THEMES.DARK:
      activeTheme = darkTheme;
      isDarkMode = true;
      break;
    case THEMES.LIGHT:
      activeTheme = lightTheme;
      isDarkMode = false;
      break;
    case THEMES.SYSTEM:
    default:
      isDarkMode = colorScheme === 'dark';
      activeTheme = isDarkMode ? darkTheme : lightTheme;
      break;
  }
  
  // Context value
  const contextValue = {
    theme: activeTheme,
    themeMode,
    setThemeMode,
    isDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;