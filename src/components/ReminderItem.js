import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';
import DatePicker from './DatePicker';

const ReminderItem = ({
  reminder,
  onToggle,
  onTimeChange,
  onDelete,
  style = {}
}) => {
  const { theme } = useTheme();
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Get icon based on reminder type
  const getIcon = () => {
    const type = reminder.type.toLowerCase();
    if (type.includes('food') || type.includes('meal')) return 'coffee';
    if (type.includes('water')) return 'droplet';
    if (type.includes('exercise') || type.includes('workout')) return 'activity';
    if (type.includes('sleep')) return 'moon';
    if (type.includes('mood')) return 'smile';
    return 'bell';
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        },
        style
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.leftContainer}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: theme.reminderIconBackground }
            ]}
          >
            <Feather name={getIcon()} size={18} color={theme.primary} />
          </View>
        </View>
        
        <View style={styles.centerContainer}>
          <Text 
            style={[styles.title, { color: theme.text }]}
            numberOfLines={1}
          >
            {reminder.title}
          </Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            accessibilityLabel={`Change time for ${reminder.title}`}
            accessibilityRole="button"
          >
            <Text style={[styles.time, { color: theme.primary }]}>
              {formatTime(reminder.time)}
            </Text>
          </TouchableOpacity>
          {reminder.frequency && (
            <Text 
              style={[styles.frequency, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {formatFrequency(reminder.frequency)}
            </Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          <Switch
            value={reminder.enabled}
            onValueChange={() => onToggle(reminder.id, !reminder.enabled)}
            trackColor={{ false: theme.switchTrackOff, true: theme.switchTrackOn }}
            thumbColor={theme.switchThumb}
            ios_backgroundColor={theme.switchTrackOff}
            accessibilityLabel={`Toggle ${reminder.title} reminder`}
            accessibilityRole="switch"
            accessibilityState={{ checked: reminder.enabled }}
          />
          
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(reminder.id)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              accessibilityLabel={`Delete ${reminder.title} reminder`}
              accessibilityRole="button"
            >
              <Feather name="trash-2" size={16} color={theme.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showTimePicker && (
        <View style={styles.timePickerContainer}>
          <DatePicker
            date={parseTime(reminder.time)}
            onChange={(date) => {
              onTimeChange(reminder.id, formatTimeFromDate(date));
              setShowTimePicker(false);
            }}
            mode="time"
            format="h:mm a"
            label=""
          />
        </View>
      )}
    </View>
  );
};

// Helper functions for time formatting
const formatTime = (timeString) => {
  if (!timeString) return '00:00';
  
  try {
    // Handle different time formats
    if (timeString.includes(':')) {
      // Format: "HH:MM" or "HH:MM AM/PM"
      const [hours, minutesPart] = timeString.split(':');
      let minutes = minutesPart;
      let period = '';
      
      if (minutesPart.includes(' ')) {
        [minutes, period] = minutesPart.split(' ');
      }
      
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // If it's a date object or timestamp
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  } catch (error) {
    console.error('Error formatting time:', error);
  }
  
  return timeString; // Return original if parsing fails
};

const parseTime = (timeString) => {
  if (!timeString) return new Date();
  
  try {
    // Handle different time formats
    if (timeString.includes(':')) {
      const [hours, minutesPart] = timeString.split(':');
      let minutes = minutesPart;
      let isPM = false;
      
      if (minutesPart.toLowerCase().includes('pm')) {
        isPM = true;
        minutes = minutesPart.toLowerCase().replace('pm', '').trim();
      } else if (minutesPart.toLowerCase().includes('am')) {
        minutes = minutesPart.toLowerCase().replace('am', '').trim();
      }
      
      const date = new Date();
      let hour = parseInt(hours, 10);
      
      if (isPM && hour < 12) {
        hour += 12;
      } else if (!isPM && hour === 12) {
        hour = 0;
      }
      
      date.setHours(hour);
      date.setMinutes(parseInt(minutes, 10));
      return date;
    }
    
    // If it's a date object or timestamp
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (error) {
    console.error('Error parsing time:', error);
  }
  
  return new Date(); // Return current date if parsing fails
};

const formatTimeFromDate = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatFrequency = (frequency) => {
  if (!frequency) return 'Daily';
  
  if (Array.isArray(frequency)) {
    // If it's an array of days
    if (frequency.length === 7) return 'Daily';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDays = frequency.map(dayIndex => days[dayIndex]).join(', ');
    return selectedDays;
  }
  
  if (typeof frequency === 'string') {
    return frequency;
  }
  
  return 'Daily';
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    padding: SPACING.md,
  },
  leftContainer: {
    marginRight: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: 2,
  },
  time: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  frequency: {
    fontSize: FONT_SIZES.xs,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  deleteButton: {
    marginTop: SPACING.sm,
    padding: SPACING.xs,
  },
  timePickerContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
});

export default ReminderItem;
