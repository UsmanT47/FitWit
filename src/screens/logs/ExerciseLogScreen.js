import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import DatePicker from '../../components/DatePicker';
import CustomButton from '../../components/CustomButton';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { logExercise, getExerciseHistory } from '../../services/storageService';
import { formatDate, formatTime } from '../../utils/dateUtils';

// Exercise types
const EXERCISE_TYPES = [
  'Running',
  'Walking',
  'Cycling',
  'Swimming',
  'Gym Workout',
  'Yoga',
  'HIIT',
  'Pilates',
  'Dance',
  'Sports',
  'Other'
];

const ExerciseLogScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Form state
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('moderate');
  const [date, setDate] = useState(new Date());
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [isOutdoor, setIsOutdoor] = useState(false);
  
  // History state
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Load exercise history on mount
  useEffect(() => {
    loadExerciseHistory();
  }, []);
  
  // Load exercise history
  const loadExerciseHistory = async () => {
    try {
      const history = await getExerciseHistory();
      setExerciseHistory(history);
    } catch (error) {
      console.error('Error loading exercise history:', error);
    }
  };
  
  // Handle submitting the exercise log
  const handleSubmit = async () => {
    if (!exerciseType) {
      Alert.alert('Missing Information', 'Please select an exercise type');
      return;
    }
    
    if (!duration || isNaN(parseInt(duration))) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const exerciseData = {
        type: exerciseType,
        duration: parseInt(duration),
        intensity,
        date: formatDate(date, 'yyyy-MM-dd'),
        time: formatTime(date),
        calories: calories ? parseInt(calories) : null,
        notes,
        isOutdoor,
      };
      
      await logExercise(exerciseData);
      
      // Refresh history
      await loadExerciseHistory();
      
      // Reset form
      setExerciseType('');
      setDuration('30');
      setIntensity('moderate');
      setDate(new Date());
      setCalories('');
      setNotes('');
      setIsOutdoor(false);
      
      // Show confirmation
      Alert.alert('Success', 'Exercise logged successfully!');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to log exercise. Please try again.');
      console.error('Error logging exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting an exercise type
  const handleSelectExerciseType = (type) => {
    setExerciseType(type);
  };
  
  // Render exercise type button
  const renderExerciseTypeButton = (type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.exerciseTypeButton,
        exerciseType === type && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        exerciseType !== type && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => handleSelectExerciseType(type)}
      accessibilityLabel={`Select ${type} exercise`}
      accessibilityRole="button"
      accessibilityState={{ selected: exerciseType === type }}
    >
      <Text 
        style={[
          styles.exerciseTypeText,
          { color: exerciseType === type ? '#fff' : theme.text }
        ]}
      >
        {type}
      </Text>
    </TouchableOpacity>
  );
  
  // Render intensity option
  const renderIntensityOption = (value, label) => (
    <TouchableOpacity
      style={[
        styles.intensityOption,
        intensity === value && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        intensity !== value && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => setIntensity(value)}
      accessibilityLabel={`Select ${label} intensity`}
      accessibilityRole="button"
      accessibilityState={{ selected: intensity === value }}
    >
      <Text 
        style={[
          styles.intensityText,
          { color: intensity === value ? '#fff' : theme.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Toggle history view
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Log Exercise" 
        showBackButton={true}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Exercise Type
            </Text>
            
            <View style={styles.exerciseTypesContainer}>
              {EXERCISE_TYPES.map(type => renderExerciseTypeButton(type))}
            </View>
            
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Duration (minutes)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input,
                      borderColor: theme.inputBorder,
                      color: theme.text
                    }
                  ]}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  placeholder="Enter duration"
                  placeholderTextColor={theme.textSecondary}
                  accessibilityLabel="Duration in minutes"
                />
              </View>
              
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Calories Burned (optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.input,
                      borderColor: theme.inputBorder,
                      color: theme.text
                    }
                  ]}
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="number-pad"
                  placeholder="Enter calories"
                  placeholderTextColor={theme.textSecondary}
                  accessibilityLabel="Calories burned"
                />
              </View>
            </View>
            
            <Text style={[styles.label, { color: theme.text }]}>
              Intensity
            </Text>
            <View style={styles.intensityContainer}>
              {renderIntensityOption('light', 'Light')}
              {renderIntensityOption('moderate', 'Moderate')}
              {renderIntensityOption('vigorous', 'Vigorous')}
            </View>
            
            <DatePicker
              label="Date & Time"
              date={date}
              onChange={setDate}
              mode="datetime"
              format="MMM dd, yyyy h:mm a"
            />
            
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: theme.text }]}>
                Outdoor Activity
              </Text>
              <Switch
                value={isOutdoor}
                onValueChange={setIsOutdoor}
                trackColor={{ false: theme.switchTrackOff, true: theme.switchTrackOn }}
                thumbColor={theme.switchThumb}
                ios_backgroundColor={theme.switchTrackOff}
              />
            </View>
            
            <Text style={[styles.label, { color: theme.text }]}>
              Notes (optional)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.input,
                  borderColor: theme.inputBorder,
                  color: theme.text
                }
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about your workout..."
              placeholderTextColor={theme.textSecondary}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Exercise notes"
            />
            
            <CustomButton
              title="Log Exercise"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              accessibilityLabel="Submit exercise log"
            />
            
            <TouchableOpacity
              style={styles.historyButton}
              onPress={toggleHistory}
              accessibilityLabel="Toggle exercise history"
              accessibilityRole="button"
            >
              <Text style={[styles.historyButtonText, { color: theme.primary }]}>
                {showHistory ? 'Hide Exercise History' : 'Show Exercise History'}
              </Text>
              <Feather 
                name={showHistory ? 'chevron-up' : 'chevron-down'} 
                size={18} 
                color={theme.primary} 
              />
            </TouchableOpacity>
            
            {showHistory && (
              <View style={styles.historyContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Recent Exercise
                </Text>
                
                {exerciseHistory.length > 0 ? (
                  exerciseHistory.map((item, index) => (
                    <View 
                      key={`exercise-${index}`}
                      style={[
                        styles.historyItem,
                        { 
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.border
                        }
                      ]}
                    >
                      <View style={styles.historyItemHeader}>
                        <Text style={[styles.historyItemType, { color: theme.text }]}>
                          {item.type}
                        </Text>
                        <Text style={[styles.historyItemDate, { color: theme.textSecondary }]}>
                          {item.date}
                        </Text>
                      </View>
                      
                      <View style={styles.historyItemDetails}>
                        <Text style={[styles.historyItemDetail, { color: theme.text }]}>
                          {item.duration} mins • {item.intensity}
                        </Text>
                        
                        {item.calories && (
                          <Text style={[styles.historyItemDetail, { color: theme.text }]}>
                            {item.calories} calories
                          </Text>
                        )}
                      </View>
                      
                      {item.notes && (
                        <Text 
                          style={[styles.historyItemNotes, { color: theme.textSecondary }]}
                          numberOfLines={2}
                        >
                          {item.notes}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={[styles.emptyHistory, { color: theme.textSecondary }]}>
                    No exercise history yet. Log your first workout!
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  formContainer: {
    
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  exerciseTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  exerciseTypeButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  exerciseTypeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
  },
  intensityContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  intensityOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    marginRight: SPACING.xs,
    borderRadius: 8,
  },
  intensityText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  switchLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.sm,
    height: 100,
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginBottom: SPACING.lg,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  historyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
  historyContainer: {
    marginTop: SPACING.sm,
  },
  historyItem: {
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  historyItemType: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  historyItemDate: {
    fontSize: FONT_SIZES.sm,
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  historyItemDetail: {
    fontSize: FONT_SIZES.sm,
  },
  historyItemNotes: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  emptyHistory: {
    textAlign: 'center',
    marginVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
});

export default ExerciseLogScreen;
