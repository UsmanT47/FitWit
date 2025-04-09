import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
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
import MoodSelector from '../../components/MoodSelector';
import CustomButton from '../../components/CustomButton';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { logMood, getMoodHistory } from '../../services/storageService';
import { formatDate } from '../../utils/dateUtils';

// Mood values and labels
const MOOD_LABELS = {
  1: { label: 'Terrible', color: '#F44336' },
  2: { label: 'Bad', color: '#FF9800' },
  3: { label: 'Neutral', color: '#9E9E9E' },
  4: { label: 'Good', color: '#4CAF50' },
  5: { label: 'Great', color: '#2196F3' },
};

// Mood factors that might affect mood
const MOOD_FACTORS = [
  'Sleep Quality',
  'Stress Level',
  'Physical Activity',
  'Social Interactions',
  'Work/School',
  'Weather',
  'Nutrition',
  'Health',
  'Personal Achievement',
  'Other'
];

const MoodLogScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Form state
  const [moodValue, setMoodValue] = useState(3);
  const [factors, setFactors] = useState([]);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  // History state
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Load mood history on mount
  useEffect(() => {
    loadMoodHistory();
  }, []);
  
  // Load mood history
  const loadMoodHistory = async () => {
    try {
      const history = await getMoodHistory();
      setMoodHistory(history);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };
  
  // Handle submitting the mood log
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const moodData = {
        value: moodValue,
        label: MOOD_LABELS[moodValue].label,
        color: MOOD_LABELS[moodValue].color,
        factors: factors,
        date: formatDate(date, 'yyyy-MM-dd'),
        time: formatDate(date, 'HH:mm'),
        notes: notes,
      };
      
      await logMood(moodData);
      
      // Refresh history
      await loadMoodHistory();
      
      // Reset form
      setMoodValue(3);
      setFactors([]);
      setDate(new Date());
      setNotes('');
      
      // Show confirmation
      Alert.alert('Success', 'Mood logged successfully!');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood. Please try again.');
      console.error('Error logging mood:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle factor selection
  const toggleFactor = (factor) => {
    if (factors.includes(factor)) {
      setFactors(factors.filter(f => f !== factor));
    } else {
      setFactors([...factors, factor]);
    }
  };
  
  // Render factor button
  const renderFactorButton = (factor) => (
    <TouchableOpacity
      key={factor}
      style={[
        styles.factorButton,
        factors.includes(factor) && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        !factors.includes(factor) && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => toggleFactor(factor)}
      accessibilityLabel={`${factor} factor`}
      accessibilityRole="button"
      accessibilityState={{ selected: factors.includes(factor) }}
    >
      <Text 
        style={[
          styles.factorText,
          { color: factors.includes(factor) ? '#fff' : theme.text }
        ]}
      >
        {factor}
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
        title="Log Mood" 
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
              How are you feeling?
            </Text>
            
            <MoodSelector
              value={moodValue}
              onChange={setMoodValue}
              showLabels={true}
              size="large"
              style={styles.moodSelector}
            />
            
            <DatePicker
              label="Date & Time"
              date={date}
              onChange={setDate}
              mode="datetime"
              format="MMM dd, yyyy h:mm a"
            />
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              What factors are affecting your mood?
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Select all that apply
            </Text>
            
            <View style={styles.factorsContainer}>
              {MOOD_FACTORS.map(factor => renderFactorButton(factor))}
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
              placeholder="Add any details about how you feel or what's affecting your mood..."
              placeholderTextColor={theme.textSecondary}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Mood notes"
            />
            
            <CustomButton
              title="Log Mood"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              accessibilityLabel="Submit mood log"
            />
            
            <TouchableOpacity
              style={styles.historyButton}
              onPress={toggleHistory}
              accessibilityLabel="Toggle mood history"
              accessibilityRole="button"
            >
              <Text style={[styles.historyButtonText, { color: theme.primary }]}>
                {showHistory ? 'Hide Mood History' : 'Show Mood History'}
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
                  Recent Moods
                </Text>
                
                {moodHistory.length > 0 ? (
                  moodHistory.map((item, index) => (
                    <View 
                      key={`mood-${index}`}
                      style={[
                        styles.historyItem,
                        { 
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.border
                        }
                      ]}
                    >
                      <View style={styles.historyItemHeader}>
                        <View style={styles.moodLabelContainer}>
                          <Text style={[styles.moodEmoji, { color: item.color }]}>
                            {getMoodEmoji(item.value)}
                          </Text>
                          <Text style={[styles.moodLabel, { color: theme.text }]}>
                            {item.label}
                          </Text>
                        </View>
                        <Text style={[styles.historyItemDate, { color: theme.textSecondary }]}>
                          {item.date} {item.time}
                        </Text>
                      </View>
                      
                      {item.factors && item.factors.length > 0 && (
                        <View style={styles.factorTagsContainer}>
                          {item.factors.map((factor, idx) => (
                            <View 
                              key={`factor-${idx}`}
                              style={[
                                styles.factorTag,
                                { 
                                  backgroundColor: `${item.color}20`,
                                  borderColor: item.color
                                }
                              ]}
                            >
                              <Text style={[styles.factorTagText, { color: item.color }]}>
                                {factor}
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
                    No mood history yet. Log your first mood!
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

// Helper function to get mood emoji based on value
const getMoodEmoji = (value) => {
  switch (value) {
    case 1: return '😞';
    case 2: return '😕';
    case 3: return '😐';
    case 4: return '🙂';
    case 5: return '😁';
    default: return '😐';
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
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  moodSelector: {
    marginBottom: SPACING.md,
  },
  factorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  factorButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  factorText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
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
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  moodLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: FONT_SIZES.xl,
    marginRight: SPACING.xs,
  },
  moodLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  historyItemDate: {
    fontSize: FONT_SIZES.sm,
  },
  factorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
  },
  factorTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  factorTagText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
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

export default MoodLogScreen;
