import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../utils/dateUtils';
import { logWater, getUserData } from '../../services/storageService';

const WaterLogScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [waterData, setWaterData] = useState({
    glasses: 0,
    goal: 8,
    date: formatDate(new Date()),
  });
  
  // Load water data on mount
  useEffect(() => {
    loadWaterData();
  }, []);
  
  // Load user's water data
  const loadWaterData = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserData();
      
      if (userData.water && userData.water.length > 0) {
        setWaterData(userData.water[0]);
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update water glasses count
  const updateGlasses = async (newCount) => {
    // Prevent negative values
    if (newCount < 0) return;
    
    // Update state
    setWaterData({
      ...waterData,
      glasses: newCount,
    });
  };
  
  // Update water goal
  const updateGoal = async (change) => {
    const newGoal = waterData.goal + change;
    
    // Prevent goal below 1
    if (newGoal < 1) return;
    
    // Update state
    setWaterData({
      ...waterData,
      goal: newGoal,
    });
  };
  
  // Save water log
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Create water log entry
      const waterEntry = {
        ...waterData,
        date: formatDate(new Date()),
      };
      
      // Save to storage
      await logWater(waterEntry);
      
      // Show success message
      Alert.alert(
        'Success',
        'Water intake logged successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving water log:', error);
      Alert.alert('Error', 'Failed to save water log');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render a glass of water (filled or empty)
  const WaterGlass = ({ isFilled, onPress }) => (
    <TouchableOpacity
      style={styles.glassContainer}
      onPress={onPress}
    >
      <Ionicons 
        name={isFilled ? "water" : "water-outline"} 
        size={36} 
        color={isFilled ? theme.info.main : theme.text.tertiary} 
      />
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary.main} />
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Water Intake
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              {formatDate(new Date(), 'EEEE, MMMM d')}
            </Text>
          </View>
          
          {/* Progress Summary */}
          <View style={[styles.progressCard, { backgroundColor: theme.background.secondary }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: theme.text.primary }]}>
                Today's Progress
              </Text>
              <Text style={[styles.progressStat, { color: theme.info.main }]}>
                {waterData.glasses} / {waterData.goal} glasses
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    backgroundColor: theme.background.tertiary,
                    width: '100%',
                  }
                ]}
              />
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.info.main,
                    width: `${Math.min(100, (waterData.glasses / waterData.goal) * 100)}%`,
                  }
                ]}
              />
            </View>
            
            <Text style={[styles.progressText, { color: theme.text.secondary }]}>
              {waterData.glasses >= waterData.goal 
                ? '🎉 Great job! You\'ve reached your water goal for today.'
                : `${waterData.goal - waterData.glasses} more ${
                    waterData.goal - waterData.glasses === 1 ? 'glass' : 'glasses'
                  } to reach your daily goal.`
              }
            </Text>
          </View>
          
          {/* Water Glasses */}
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Add Water
          </Text>
          
          <View style={styles.glassesContainer}>
            {/* Quick Presets */}
            <View style={styles.quickPresets}>
              <TouchableOpacity
                style={[styles.presetButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => updateGlasses(1)}
              >
                <Text style={[styles.presetText, { color: theme.text.primary }]}>1</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.presetButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => updateGlasses(4)}
              >
                <Text style={[styles.presetText, { color: theme.text.primary }]}>4</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.presetButton, { backgroundColor: theme.background.secondary }]}
                onPress={() => updateGlasses(8)}
              >
                <Text style={[styles.presetText, { color: theme.text.primary }]}>8</Text>
              </TouchableOpacity>
            </View>
            
            {/* Row of glasses */}
            <View style={styles.glassRow}>
              {Array.from({ length: 8 }).map((_, index) => (
                <WaterGlass 
                  key={index}
                  isFilled={index < waterData.glasses} 
                  onPress={() => updateGlasses(index + 1)}
                />
              ))}
            </View>
            
            {/* Adjustment Controls */}
            <View style={styles.adjustmentRow}>
              <TouchableOpacity
                style={[styles.adjustButton, { backgroundColor: theme.error.light }]}
                onPress={() => updateGlasses(waterData.glasses - 1)}
              >
                <Ionicons name="remove" size={24} color={theme.error.main} />
              </TouchableOpacity>
              
              <View style={[styles.glassCounter, { backgroundColor: theme.background.secondary }]}>
                <Text style={[styles.glassCounterText, { color: theme.text.primary }]}>
                  {waterData.glasses}
                </Text>
                <Text style={[styles.glassLabel, { color: theme.text.secondary }]}>
                  {waterData.glasses === 1 ? 'glass' : 'glasses'}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.adjustButton, { backgroundColor: theme.success.light }]}
                onPress={() => updateGlasses(waterData.glasses + 1)}
              >
                <Ionicons name="add" size={24} color={theme.success.main} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Daily Goal */}
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Daily Goal
          </Text>
          
          <View style={[styles.goalCard, { backgroundColor: theme.background.secondary }]}>
            <Text style={[styles.goalText, { color: theme.text.secondary }]}>
              Set your daily water intake goal
            </Text>
            
            <View style={styles.goalAdjustment}>
              <TouchableOpacity
                style={[styles.goalAdjustButton, { backgroundColor: theme.background.tertiary }]}
                onPress={() => updateGoal(-1)}
              >
                <Ionicons name="remove" size={24} color={theme.text.primary} />
              </TouchableOpacity>
              
              <Text style={[styles.goalValue, { color: theme.text.primary }]}>
                {waterData.goal} glasses
              </Text>
              
              <TouchableOpacity
                style={[styles.goalAdjustButton, { backgroundColor: theme.background.tertiary }]}
                onPress={() => updateGoal(1)}
              >
                <Ionicons name="add" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Benefits Info */}
          <View style={[styles.benefitsCard, { backgroundColor: theme.info.light }]}>
            <Ionicons name="information-circle" size={24} color={theme.info.main} />
            <Text style={[styles.benefitsText, { color: theme.info.dark }]}>
              Staying hydrated improves energy levels, brain function, and helps maintain physical performance.
            </Text>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary.main }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.primary.contrast} />
            ) : (
              <Text style={[styles.saveButtonText, { color: theme.primary.contrast }]}>
                Save Water Log
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
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
  progressCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  progressTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  progressStat: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    marginBottom: SPACING.MEDIUM,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    fontSize: FONT_SIZES.SMALL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  glassesContainer: {
    marginBottom: SPACING.LARGE,
  },
  quickPresets: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
  },
  presetButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SPACING.SMALL,
    marginRight: SPACING.MEDIUM,
  },
  presetText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  glassRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.MEDIUM,
  },
  glassContainer: {
    width: '12.5%',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCounter: {
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    marginHorizontal: SPACING.MEDIUM,
    alignItems: 'center',
  },
  glassCounterText: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: 'bold',
  },
  glassLabel: {
    fontSize: FONT_SIZES.SMALL,
  },
  goalCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  goalText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  goalAdjustment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalAdjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalValue: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: 'bold',
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

export default WaterLogScreen;