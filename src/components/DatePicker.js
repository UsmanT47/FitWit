import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';
import { formatDate } from '../utils/dateUtils';

const DatePicker = ({ 
  date, 
  onChange, 
  label = 'Date', 
  mode = 'date',
  format = 'MMM dd, yyyy',
  minimumDate,
  maximumDate,
  style = {}
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  
  // Function to show the date picker
  const showDatePicker = () => {
    setShowPicker(true);
  };
  
  // Handle date change
  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
    
    if (Platform.OS === 'ios') {
      // iOS keeps the picker open
      // We'll close it in the confirm handler
    }
  };
  
  // Confirm button handler for iOS
  const handleIOSConfirm = () => {
    setShowPicker(false);
  };
  
  // Cancel button handler for iOS
  const handleIOSCancel = () => {
    setShowPicker(false);
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text 
          style={[styles.label, { color: theme.text }]}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.border 
          }
        ]}
        onPress={showDatePicker}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
        accessibilityHint={`Shows date picker to select ${mode}`}
      >
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDate(date, format)}
        </Text>
        <Feather 
          name={mode === 'date' ? 'calendar' : 'clock'} 
          size={18} 
          color={theme.primary} 
        />
      </TouchableOpacity>
      
      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
      
      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={handleIOSCancel}
        >
          <View style={styles.iosModalContainer}>
            <View style={[styles.iosPickerContainer, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.iosButtonRow}>
                <TouchableOpacity onPress={handleIOSCancel}>
                  <Text style={[styles.iosButtonText, { color: theme.danger }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleIOSConfirm}>
                  <Text style={[styles.iosButtonText, { color: theme.primary }]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={date || new Date()}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                style={styles.iosPicker}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                textColor={theme.text}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: FONT_SIZES.md,
  },
  // iOS specific styles
  iosModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosPickerContainer: {
    padding: SPACING.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iosButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  iosButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
  },
});

export default DatePicker;
