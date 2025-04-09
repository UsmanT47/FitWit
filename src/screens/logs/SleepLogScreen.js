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
import { logSleep, getSleepHistory } from '../../services/storageService';
import { formatDate, formatTime, calculateTimeDifference } from '../../utils/dateUtils';
import { DEFAULT_VALUES } from '../../constants/config';

// Sleep quality options
const SLEEP_QUALITY = [
  'Poor',
  'Fair',
  'Good',
  'Excellent'
];

// Sleep disruptors
const SLEEP_DISRUPTORS = [
  'Stress',
  'Noise',
  'Light',
  'Temperature',
  'Caffeine',
  'Alcohol',
  'Screen Time',
  'Late Meal',
  'Uncomfortable Bed',
  'Partner/Pet'
];

const SleepLogScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Form state
  const [bedtime, setBedtime] = useState(new Date(new Date().setHours(22, 0, 0, 0)));
  const [wakeTime, setWakeTime] = useState(new Date(new Date().setHours(6, 0, 0, 0)));
  const [duration, setDuration] = useState('8');
  const [quality, setQuality] = useState('Good');
  const [disruptors, setDisruptors] = useState([]);
  const [deepSleep, setDeepSleep] = useState(false);
  const [notes, setNotes] = useState('');
  
  // History state
  const [sleepHistory, setSleepHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Load sleep history on mount
  useEffect(() => {
    loadSleepHistory();
  }, []);
  
  // Update duration when bedtime or wake time changes
  useEffect(() => {
    if (bedtime && wakeTime) {
      const hours = calculateTimeDifference(bedtime, wakeTime);
      setDuration(hours.toFixed(1));
    }
  }, [bedtime, wakeTime]);
  
  // Load sleep history
  const loadSleepHistory = async () => {
    try {
      const history = await getSleepHistory();
      setSleepHistory(history);
    } catch (error) {
      console.error('Error loading sleep history:', error);
    }
  };
  
  // Handle submitting the sleep log
  const handleSubmit = async () => {
    if (isNaN(parseFloat(duration)) || parseFloat(duration) <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid sleep duration');
      return;
    }
    
    if (parseFloat(duration) > 24) {
      Alert.alert('Invalid Duration', 'Sleep duration cannot exceed 24 hours');
      return;
    }
    
    if (!quality) {
      Alert.alert('Missing Information', 'Please select a sleep quality');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const sleepData = {
        date: formatDate(bedtime, 'yyyy-MM-dd'),
        bedtime: formatTime(bedtime),
        wakeTime: formatTime(wakeTime),
        duration: parseFloat(duration),
        quality: quality,
        disruptors: disruptors,
        deepSleep: deepSleep,
        notes: notes,
      };
      
      await logSleep(sleepData);
      
      // Refresh history
      await loadSleepHistory();
      
      // Reset form to defaults
      setBedtime(new Date(new Date().setHours(22, 0, 0, 0)));
      setWakeTime(new Date(new Date().setHours(6, 0, 0, 0)));
      setDuration('8');
      setQuality('Good');
      setDisruptors([]);
      setDeepSleep(false);
      setNotes('');
      
      // Show confirmation
      Alert.alert('Success', 'Sleep logged successfully!');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to log sleep. Please try again.');
      console.error('Error logging sleep:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle disruptor selection
  const toggleDisruptor = (disruptor) => {
    if (disruptors.includes(disruptor)) {
      setDisruptors(disruptors.filter(d => d !== disruptor));
    } else {
      setDisruptors([...disruptors, disruptor]);
    }
  };
  
  // Render quality button
  const renderQualityButton = (value) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.qualityButton,
        quality === value && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        quality !== value && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => setQuality(value)}
      accessibilityLabel={`Select ${value} quality`}
      accessibilityRole="button"
      accessibilityState={{ selected: quality === value }}
    >
      <Text 
        style={[
          styles.qualityText,
          { color: quality === value ? '#fff' : theme.text }
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
  
  // Render disruptor button
  const renderDisruptorButton = (disruptor) => (
    <TouchableOpacity
      key={disruptor}
      style={[
        styles.disruptorButton,
        disruptors.includes(disruptor) && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        !disruptors.includes(disruptor) && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => toggleDisruptor(disruptor)}
      accessibilityLabel={`${disruptor} disruptor`}
      accessibilityRole="button"
      accessibilityState={{ selected: disruptors.includes(disruptor) }}
    >
      <Text 
        style={[
          styles.disruptorText,
          { color: disruptors.includes(disruptor) ? '#fff' : theme.text }
        ]}
      >
        {disruptor}
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
        title="Log Sleep" 
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
              Log Your Sleep
            </Text>
            
            <View style={styles.timeContainer}>
              <View style={styles.halfWidth}>
                <DatePicker
                  label="Bedtime"
                  date={bedtime}
                  onChange={setBedtime}
                  mode="time"
                  format="h:mm a"
                />
              </View>
              
              <View style={styles.halfWidth}>
                <DatePicker
                  label="Wake Time"
                  date={wakeTime}
                  onChange={setWakeTime}
                  mode="time"
                  format="h:mm a"
                />
              </View>
            </View>
            
            <View 
              style={[
                styles.durationContainer,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border
                }
              ]}
            >
              <Text style={[styles.durationLabel, { color: theme.textSecondary }]}>
                Sleep Duration
              </Text>
              <Text style={[styles.durationValue, { color: theme.text }]}>
                {duration} hours
              </Text>
              <View 
                style={[
                  styles.progressBar, 
                  { backgroundColor: theme.progressBarBackground }
                ]}
              >
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: getSleepQualityColor(parseFloat(duration), theme),
                      width: `${Math.min((parseFloat(duration) / DEFAULT_VALUES.SLEEP_GOAL) * 100, 100)}%`
                    }
                  ]}
                />
              </View>
              <Text style={[styles.goalText, { color: theme.textSecondary }]}>
                {parseFloat(duration) < DEFAULT_VALUES.SLEEP_GOAL 
                  ? `${(DEFAULT_VALUES.SLEEP_GOAL - parseFloat(duration)).toFixed(1)} hours below goal`
                  : `${(parseFloat(duration) - DEFAULT_VALUES.SLEEP_GOAL).toFixed(1)} hours above goal`}
              </Text>
            </View>
            
            <Text style={[styles.label, { color: theme.text }]}>
              Sleep Quality
            </Text>
            <View style={styles.qualityContainer}>
              {SLEEP_QUALITY.map(value => renderQualityButton(value))}
            </View>
            
            <Text style={[styles.label, { color: theme.text }]}>
              Sleep Disruptors (if any)
            </Text>
            <View style={styles.disruptorsContainer}>
              {SLEEP_DISRUPTORS.map(disruptor => renderDisruptorButton(disruptor))}
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: theme.text }]}>
                Felt Well-Rested
              </Text>
              <Switch
                value={deepSleep}
                onValueChange={setDeepSleep}
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
              placeholder="Add any notes about your sleep..."
              placeholderTextColor={theme.textSecondary}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Sleep notes"
            />
            
            <CustomButton
              title="Log Sleep"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              accessibilityLabel="Submit sleep log"
            />
            
            <TouchableOpacity
              style={styles.historyButton}
              onPress={toggleHistory}
              accessibilityLabel="Toggle sleep history"
              accessibilityRole="button"
            >
              <Text style={[styles.historyButtonText, { color: theme.primary }]}>
                {showHistory ? 'Hide Sleep History' : 'Show Sleep History'}
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
                  Recent Sleep
                </Text>
                
                {sleepHistory.length > 0 ? (
                  sleepHistory.map((item, index) => (
                    <View 
                      key={`sleep-${index}`}
                      style={[
                        styles.historyItem,
                        { 
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.border
                        }
                      ]}
                    >
                      <View style={styles.historyItemHeader}>
                        <Text style={[styles.historyItemDate, { color: theme.text }]}>
                          {item.date}
                        </Text>
                        <Text 
                          style={[
                            styles.historyItemQuality, 
                            { color: getSleepQualityTextColor(item.quality) }
                          ]}
                        >
                          {item.quality}
                        </Text>
                      </View>
                      
                      <View style={styles.historyItemTime}>
                        <Text style={[styles.historyItemTimeText, { color: theme.text }]}>
                          {item.bedtime} - {item.wakeTime}
                        </Text>
                        <Text style={[styles.historyItemDuration, { color: theme.primary }]}>
                          {item.duration} hrs
                        </Text>
                      </View>
                      
                      {item.disruptors && item.disruptors.length > 0 && (
                        <View style={styles.disruptorTagsContainer}>
                          {item.disruptors.map((disruptor, idx) => (
                            <View 
                              key={`disruptor-${idx}`}
                              style={[
                                styles.disruptorTag,
                                { backgroundColor: theme.border }
                              ]}
                            >
                              <Text style={[styles.disruptorTagText, { color: theme.text }]}>
                                {disruptor}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
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
                    No sleep history yet. Log your first night's sleep!
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

// Helper function to get sleep quality color
const getSleepQualityColor = (hours, theme) => {
  if (hours < 6) return theme.danger;
  if (hours < 7) return theme.warning;
  if (hours <= 9) return theme.success;
  return theme.info; // More than 9 hours
};

// Helper function to get sleep quality text color
const getSleepQualityTextColor = (quality) => {
  switch (quality) {
    case 'Poor': return '#F44336';
    case 'Fair': return '#FF9800';
    case 'Good': return '#4CAF50';
    case 'Excellent': return '#2196F3';
    default: return '#9E9E9E';
  }
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfWidth: {
    width: '48%',
  },
  durationContainer: {
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  durationLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: 4,
  },
  durationValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalText: {
    fontSize: FONT_SIZES.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  qualityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    marginHorizontal: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  qualityText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  disruptorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  disruptorButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  disruptorText: {
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
  historyItemDate: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  historyItemQuality: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  historyItemTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  historyItemTimeText: {
    fontSize: FONT_SIZES.sm,
  },
  historyItemDuration: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  disruptorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  disruptorTag: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  disruptorTagText: {
    fontSize: FONT_SIZES.xs,
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

export default SleepLogScreen;
