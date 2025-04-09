// Brand colors
export const BRAND = {
  PRIMARY: '#4285F4', // Blue
  SECONDARY: '#34A853', // Green
  ACCENT: '#EA4335', // Red
  NEUTRAL: '#FBBC05', // Yellow
};

// Light theme colors
export const lightTheme = {
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F4',
    accent: '#E8F0FE',
  },
  // Text colors
  text: {
    primary: '#202124',
    secondary: '#5F6368',
    tertiary: '#80868B',
    accent: BRAND.PRIMARY,
    inverse: '#FFFFFF',
  },
  // Border colors
  border: {
    light: '#DADCE0',
    medium: '#BDC1C6',
    dark: '#9AA0A6',
  },
  // Button colors
  button: {
    primary: {
      background: BRAND.PRIMARY,
      text: '#FFFFFF',
    },
    secondary: {
      background: '#FFFFFF',
      text: BRAND.PRIMARY,
      border: BRAND.PRIMARY,
    },
    success: {
      background: BRAND.SECONDARY,
      text: '#FFFFFF',
    },
    danger: {
      background: BRAND.ACCENT,
      text: '#FFFFFF',
    },
    warning: {
      background: BRAND.NEUTRAL,
      text: '#202124',
    },
    disabled: {
      background: '#F1F3F4',
      text: '#9AA0A6',
      border: '#DADCE0',
    },
  },
  // Card colors
  card: {
    background: '#FFFFFF',
    shadow: 'rgba(60, 64, 67, 0.15)',
  },
  // Status colors
  status: {
    success: BRAND.SECONDARY,
    error: BRAND.ACCENT,
    warning: BRAND.NEUTRAL,
    info: BRAND.PRIMARY,
  },
  // Chart colors
  chart: {
    primary: BRAND.PRIMARY,
    secondary: BRAND.SECONDARY,
    tertiary: BRAND.ACCENT,
    quaternary: BRAND.NEUTRAL,
    gradient: {
      start: `${BRAND.PRIMARY}80`, // 50% opacity
      end: `${BRAND.PRIMARY}10`, // 10% opacity
    },
  },
  // Mood colors
  mood: {
    happy: '#FF9F1C',
    calm: '#2EC4B6',
    sad: '#6E83B7',
    stressed: '#EA4335',
    angry: '#BF0603',
    neutral: '#9AA0A6',
  },
  // Misc
  divider: '#DADCE0',
  overlay: 'rgba(32, 33, 36, 0.4)',
};

// Dark theme colors
export const darkTheme = {
  // Background colors
  background: {
    primary: '#202124',
    secondary: '#303134',
    tertiary: '#3C4043',
    accent: '#1A73E8',
  },
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#DADCE0',
    tertiary: '#9AA0A6',
    accent: '#8AB4F8',
    inverse: '#202124',
  },
  // Border colors
  border: {
    light: '#5F6368',
    medium: '#80868B',
    dark: '#9AA0A6',
  },
  // Button colors
  button: {
    primary: {
      background: '#8AB4F8',
      text: '#202124',
    },
    secondary: {
      background: '#303134',
      text: '#8AB4F8',
      border: '#8AB4F8',
    },
    success: {
      background: '#81C995',
      text: '#202124',
    },
    danger: {
      background: '#F28B82',
      text: '#202124',
    },
    warning: {
      background: '#FDD663',
      text: '#202124',
    },
    disabled: {
      background: '#3C4043',
      text: '#80868B',
      border: '#5F6368',
    },
  },
  // Card colors
  card: {
    background: '#303134',
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  // Status colors
  status: {
    success: '#81C995',
    error: '#F28B82',
    warning: '#FDD663',
    info: '#8AB4F8',
  },
  // Chart colors
  chart: {
    primary: '#8AB4F8',
    secondary: '#81C995',
    tertiary: '#F28B82',
    quaternary: '#FDD663',
    gradient: {
      start: `${BRAND.PRIMARY}80`, // 50% opacity
      end: `${BRAND.PRIMARY}10`, // 10% opacity
    },
  },
  // Mood colors
  mood: {
    happy: '#FFC857',
    calm: '#4ECDC4',
    sad: '#8EAFE0',
    stressed: '#F67280',
    angry: '#FF5A5F',
    neutral: '#9AA0A6',
  },
  // Misc
  divider: '#5F6368',
  overlay: 'rgba(0, 0, 0, 0.6)',
};