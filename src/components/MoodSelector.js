import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

// Mood emoji map
const MOOD_EMOJIS = {
  1: { emoji: '😞', label: 'Terrible' },
  2: { emoji: '😕', label: 'Bad' },
  3: { emoji: '😐', label: 'Neutral' },
  4: { emoji: '🙂', label: 'Good' },
  5: { emoji: '😁', label: 'Great' },
};

// Mood color map
const getMoodColor = (value, theme) => {
  switch (value) {
    case 1: return theme.moodColors.terrible;
    case 2: return theme.moodColors.bad;
    case 3: return theme.moodColors.neutral;
    case 4: return theme.moodColors.good;
    case 5: return theme.moodColors.great;
    default: return theme.textSecondary;
  }
};

const MoodSelector = ({ 
  value, 
  onChange, 
  showLabels = true,
  size = 'medium',
  style = {}
}) => {
  const { theme } = useTheme();
  
  // Determine size based on prop
  const getEmojiSize = () => {
    switch (size) {
      case 'small': return { fontSize: 22, containerSize: 36 };
      case 'large': return { fontSize: 32, containerSize: 60 };
      default: return { fontSize: 28, containerSize: 48 };
    }
  };
  
  const { fontSize, containerSize } = getEmojiSize();
  
  const renderMoodOption = (moodValue) => {
    const isSelected = value === moodValue;
    const mood = MOOD_EMOJIS[moodValue];
    const moodColor = getMoodColor(moodValue, theme);
    
    return (
      <View key={moodValue} style={styles.moodOptionContainer}>
        <TouchableOpacity
          style={[
            styles.moodButton,
            { 
              width: containerSize, 
              height: containerSize,
              backgroundColor: isSelected ? moodColor : theme.moodBackground,
              borderColor: isSelected ? moodColor : theme.border,
            }
          ]}
          onPress={() => onChange(moodValue)}
          activeOpacity={0.7}
          accessibilityLabel={`Select mood: ${mood.label}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <Text style={[styles.moodEmoji, { fontSize }]}>
            {mood.emoji}
          </Text>
        </TouchableOpacity>
        
        {showLabels && (
          <Text 
            style={[
              styles.moodLabel, 
              { 
                color: isSelected ? moodColor : theme.textSecondary,
                fontSize: size === 'small' ? FONT_SIZES.xs : FONT_SIZES.sm
              }
            ]}
          >
            {mood.label}
          </Text>
        )}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {Object.keys(MOOD_EMOJIS).map(moodValue => 
        renderMoodOption(parseInt(moodValue))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: SPACING.md,
  },
  moodOptionContainer: {
    alignItems: 'center',
  },
  moodButton: {
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  moodEmoji: {
    textAlign: 'center',
  },
  moodLabel: {
    textAlign: 'center',
    marginTop: 2,
  },
});

export default MoodSelector;
