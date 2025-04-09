import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../utils/dateUtils';
import { logMood } from '../../services/storageService';

const MoodLogScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [energy, setEnergy] = useState(3);
  
  // Mood options
  const moods = [
    { id: 'excellent', label: 'Excellent', icon: 'happy', color: theme.success.main },
    { id: 'good', label: 'Good', icon: 'happy-outline', color: theme.success.light },
    { id: 'okay', label: 'Okay', icon: 'sad-outline', color: theme.info.main },
    { id: 'bad', label: 'Bad', icon: 'sad', color: theme.warning.main },
    { id: 'terrible', label: 'Terrible', icon: 'thumbs-down', color: theme.error.main },
  ];
  
  // Energy levels
  const energyLevels = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' },
  ];
  
  // Select mood
  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
  };
  
  // Save mood log
  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Create mood log entry
      const moodEntry = {
        mood: selectedMood.id,
        moodLabel: selectedMood.label,
        energy,
        notes,
        date: formatDate(new Date()),
      };
      
      // Save to storage
      await logMood(moodEntry);
      
      // Show success message
      Alert.alert(
        'Success',
        'Mood logged successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving mood log:', error);
      Alert.alert('Error', 'Failed to save mood log');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render mood option
  const MoodOption = ({ mood, selected }) => (
    <TouchableOpacity
      style={[
        styles.moodOption,
        { 
          backgroundColor: selected ? mood.color : theme.background.secondary,
          borderColor: mood.color,
          borderWidth: selected ? 0 : 2,
        }
      ]}
      onPress={() => handleSelectMood(mood)}
    >
      <Ionicons 
        name={mood.icon} 
        size={32} 
        color={selected ? theme.background.primary : mood.color} 
      />
      <Text 
        style={[
          styles.moodLabel, 
          { color: selected ? theme.background.primary : theme.text.primary }
        ]}
      >
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          How are you feeling?
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          {formatDate(new Date(), 'EEEE, MMMM d')}
        </Text>
      </View>
      
      {/* Mood Selection */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Select your mood
      </Text>
      
      <View style={styles.moodOptionsContainer}>
        {moods.map((mood) => (
          <MoodOption 
            key={mood.id} 
            mood={mood} 
            selected={selectedMood?.id === mood.id} 
          />
        ))}
      </View>
      
      {/* Energy Level */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Energy Level
      </Text>
      
      <View style={[styles.energyCard, { backgroundColor: theme.background.secondary }]}>
        <View style={styles.energyLevels}>
          {energyLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.energyLevel,
                { 
                  backgroundColor: energy === level.value 
                    ? theme.primary.main 
                    : theme.background.tertiary 
                }
              ]}
              onPress={() => setEnergy(level.value)}
            >
              <Text 
                style={[
                  styles.energyLevelText,
                  { 
                    color: energy === level.value 
                      ? theme.primary.contrast 
                      : theme.text.secondary
                  }
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.energyDescription}>
          <Text style={[styles.energyDescriptionText, { color: theme.text.secondary }]}>
            {energy === 1 && "You feel extremely tired, depleted and have very little energy."}
            {energy === 2 && "You feel tired and have lower energy than usual."}
            {energy === 3 && "You have a moderate amount of energy."}
            {energy === 4 && "You feel energetic and motivated."}
            {energy === 5 && "You feel extremely energetic and full of vitality."}
          </Text>
        </View>
      </View>
      
      {/* Notes */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Notes (Optional)
      </Text>
      
      <View style={[styles.notesCard, { backgroundColor: theme.background.secondary }]}>
        <TextInput
          style={[styles.notesInput, { color: theme.text.primary }]}
          placeholder="Add any additional notes about your mood..."
          placeholderTextColor={theme.text.tertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />
        
        <View style={styles.promptsContainer}>
          <Text style={[styles.promptsTitle, { color: theme.text.secondary }]}>
            Prompts:
          </Text>
          <TouchableOpacity 
            style={styles.promptButton}
            onPress={() => setNotes(notes + "\n\n• What contributed to your mood today?")}
          >
            <Text style={[styles.promptText, { color: theme.primary.main }]}>
              + What contributed to your mood?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.promptButton}
            onPress={() => setNotes(notes + "\n\n• Activities that affected your mood:")}
          >
            <Text style={[styles.promptText, { color: theme.primary.main }]}>
              + Activities that affected mood
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Benefits Info */}
      <View style={[styles.benefitsCard, { backgroundColor: theme.primary.light }]}>
        <Ionicons name="information-circle" size={24} color={theme.primary.main} />
        <Text style={[styles.benefitsText, { color: theme.primary.dark }]}>
          Tracking your mood helps identify patterns and triggers, improving emotional awareness and overall well-being.
        </Text>
      </View>
      
      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton, 
          { 
            backgroundColor: selectedMood ? selectedMood.color : theme.primary.main,
            opacity: selectedMood ? 1 : 0.7,
          }
        ]}
        onPress={handleSave}
        disabled={isSaving || !selectedMood}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={theme.primary.contrast} />
        ) : (
          <Text style={[styles.saveButtonText, { color: theme.background.primary }]}>
            Save Mood Log
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE,
  },
  header: {
    marginBottom: SPACING.LARGE,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    marginBottom: SPACING.TINY,
  },
  subtitle: {
    fontSize: FONT_SIZES.MEDIUM,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  moodOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.LARGE,
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  moodLabel: {
    fontSize: FONT_SIZES.TINY,
    marginTop: SPACING.TINY,
    fontWeight: '500',
  },
  energyCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  energyLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MEDIUM,
  },
  energyLevel: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.SMALL,
    borderRadius: SPACING.SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    width: '19%',
  },
  energyLevelText: {
    fontSize: FONT_SIZES.TINY,
    fontWeight: '500',
  },
  energyDescription: {
    padding: SPACING.SMALL,
  },
  energyDescriptionText: {
    fontSize: FONT_SIZES.SMALL,
  },
  notesCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  notesInput: {
    height: 100,
    fontSize: FONT_SIZES.MEDIUM,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  promptsContainer: {
    marginTop: SPACING.SMALL,
  },
  promptsTitle: {
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.SMALL,
  },
  promptButton: {
    marginBottom: SPACING.SMALL,
  },
  promptText: {
    fontSize: FONT_SIZES.SMALL,
  },
  benefitsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  benefitsText: {
    fontSize: FONT_SIZES.SMALL,
    marginLeft: SPACING.MEDIUM,
    flex: 1,
  },
  saveButton: {
    height: 50,
    borderRadius: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
});

export default MoodLogScreen;