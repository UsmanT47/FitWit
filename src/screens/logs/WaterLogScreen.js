import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import DatePicker from '../../components/DatePicker';
import WaterTracker from '../../components/WaterTracker';
import CustomButton from '../../components/CustomButton';
import ProgressChart from '../../components/ProgressChart';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { DEFAULT_VALUES, VISUALIZATION_CONFIG } from '../../constants/config';
import { getWaterHistory, updateWaterIntake } from '../../services/storageService';
import { formatDate } from '../../utils/dateUtils';

const WaterLogScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Form state
  const [waterAmount, setWaterAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [customGoal, setCustomGoal] = useState(String(DEFAULT_VALUES.WATER_GOAL));
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  
  // History state
  const [waterHistory, setWaterHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load water history on mount
  useEffect(() => {
    loadWaterData();
  }, []);
  
  // Load water data
  const loadWaterData = async () => {
    try {
      const history = await getWaterHistory();
      setWaterHistory(history);
      
      // Get today's water intake
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const todayData = history.find(item => item.date === today);
      if (todayData) {
        setWaterAmount(todayData.glasses);
      }
      
      // Process data for chart
      processChartData(history);
    } catch (error) {
      console.error('Error loading water history:', error);
    }
  };
  
  // Process data for chart
  const processChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }
    
    // Sort by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get last 7 days of data
    const last7Days = sortedData.slice(-7);
    
    // Format for chart
    const chartData = last7Days.map(item => ({
      x: new Date(item.date),
      y: item.glasses,
    }));
    
    setChartData(chartData);
  };
  
  // Handle water add
  const handleAddWater = () => {
    setWaterAmount(prev => prev + 1);
  };
  
  // Handle water subtract
  const handleSubtractWater = () => {
    if (waterAmount > 0) {
      setWaterAmount(prev => prev - 1);
    }
  };
  
  // Handle submitting the water log
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const goalAmount = parseInt(customGoal) || DEFAULT_VALUES.WATER_GOAL;
      
      const waterData = {
        date: formatDate(date, 'yyyy-MM-dd'),
        glasses: waterAmount,
        goal: goalAmount,
      };
      
      await updateWaterIntake(waterAmount, goalAmount, formatDate(date, 'yyyy-MM-dd'));
      
      // Refresh history
      await loadWaterData();
      
      // Show confirmation
      Alert.alert('Success', 'Water intake logged successfully!');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to log water intake. Please try again.');
      console.error('Error logging water:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle custom goal input
  const toggleCustomGoal = () => {
    setShowCustomGoal(!showCustomGoal);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Water Intake" 
        showBackButton={true}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Track Your Hydration
          </Text>
          
          <WaterTracker
            currentAmount={waterAmount}
            goalAmount={parseInt(customGoal) || DEFAULT_VALUES.WATER_GOAL}
            onAdd={handleAddWater}
            onSubtract={handleSubtractWater}
            style={styles.waterTracker}
          />
          
          <DatePicker
            label="Date"
            date={date}
            onChange={setDate}
            mode="date"
            format="EEEE, MMMM d, yyyy"
          />
          
          <View style={styles.goalContainer}>
            <View style={styles.goalHeaderRow}>
              <Text style={[styles.label, { color: theme.text }]}>
                Daily Water Goal
              </Text>
              <TouchableOpacity
                onPress={toggleCustomGoal}
                style={styles.customizeButton}
                accessibilityLabel="Customize water goal"
                accessibilityRole="button"
              >
                <Text style={[styles.customizeText, { color: theme.primary }]}>
                  {showCustomGoal ? 'Cancel' : 'Customize'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showCustomGoal ? (
              <View style={styles.customGoalContainer}>
                <TextInput
                  style={[
                    styles.goalInput,
                    { 
                      backgroundColor: theme.input,
                      borderColor: theme.inputBorder,
                      color: theme.text
                    }
                  ]}
                  value={customGoal}
                  onChangeText={setCustomGoal}
                  keyboardType="number-pad"
                  placeholder="8"
                  placeholderTextColor={theme.textSecondary}
                  accessibilityLabel="Custom water goal in glasses"
                />
                <Text style={[styles.glassesText, { color: theme.text }]}>
                  glasses
                </Text>
              </View>
            ) : (
              <View 
                style={[
                  styles.goalDisplay,
                  { 
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border
                  }
                ]}
              >
                <Feather name="droplet" size={20} color={theme.primary} style={styles.goalIcon} />
                <Text style={[styles.goalText, { color: theme.text }]}>
                  {parseInt(customGoal) || DEFAULT_VALUES.WATER_GOAL} glasses per day
                </Text>
              </View>
            )}
          </View>
          
          <CustomButton
            title="Save Water Log"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            accessibilityLabel="Submit water log"
          />
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Weekly History
          </Text>
          
          <ProgressChart
            data={chartData}
            title="Water Intake"
            xAxisLabel="Date"
            yAxisLabel="Glasses"
            color={VISUALIZATION_CONFIG.CHART_COLORS.WATER}
            emptyStateMessage="Log your water intake to see trends"
          />
          
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.text }]}>
              Hydration Tips
            </Text>
            <View 
              style={[
                styles.tipCard,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border
                }
              ]}
            >
              <Feather name="info" size={18} color={theme.primary} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Drinking water first thing in the morning can help kickstart your metabolism.
              </Text>
            </View>
            <View 
              style={[
                styles.tipCard,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border
                }
              ]}
            >
              <Feather name="info" size={18} color={theme.primary} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Set reminders on your phone to drink water throughout the day.
              </Text>
            </View>
            <View 
              style={[
                styles.tipCard,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border
                }
              ]}
            >
              <Feather name="info" size={18} color={theme.primary} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Herbal teas and infused water count toward your daily water intake.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  waterTracker: {
    marginBottom: SPACING.md,
  },
  goalContainer: {
    marginVertical: SPACING.md,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  customizeButton: {
    padding: SPACING.xs,
  },
  customizeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  goalDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  goalIcon: {
    marginRight: SPACING.sm,
  },
  goalText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  customGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    height: 50,
    width: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    textAlign: 'center',
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  glassesText: {
    fontSize: FONT_SIZES.md,
  },
  submitButton: {
    marginVertical: SPACING.lg,
  },
  tipsContainer: {
    marginTop: SPACING.md,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  tipCard: {
    flexDirection: 'row',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  tipIcon: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
});

export default WaterLogScreen;
