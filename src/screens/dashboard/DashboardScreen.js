import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import LogCard from '../../components/LogCard';
import WaterTracker from '../../components/WaterTracker';
import InsightCard from '../../components/InsightCard';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { DEFAULT_VALUES } from '../../constants/config';
import { getUserData, updateWaterIntake } from '../../services/storageService';
import { formatDate } from '../../utils/dateUtils';
import { generateDailyInsight } from '../../services/aiService';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [refreshing, setRefreshing] = useState(false);
  const [todayData, setTodayData] = useState({
    food: null,
    mood: null,
    exercise: null,
    sleep: null,
    water: 0,
  });
  const [insights, setInsights] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [streaks, setStreaks] = useState({
    current: 0,
    longest: 0,
  });
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);
  
  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Load all data for today
  const loadDashboardData = async () => {
    try {
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const userData = await getUserData(today);
      
      // Set today's data
      setTodayData({
        food: userData.food?.length > 0 ? {
          totalCalories: userData.food.reduce((sum, item) => sum + (item.calories || 0), 0),
          mealCount: userData.food.length
        } : null,
        mood: userData.mood?.length > 0 ? userData.mood[userData.mood.length - 1] : null,
        exercise: userData.exercise?.length > 0 ? userData.exercise[userData.exercise.length - 1] : null,
        sleep: userData.sleep?.length > 0 ? userData.sleep[userData.sleep.length - 1] : null,
        water: userData.water?.glasses || 0,
      });
      
      // Get latest insights
      const generatedInsights = await generateDailyInsight();
      setInsights(generatedInsights);
      
      // Calculate streaks (simplified for now)
      setStreaks({
        current: 3, // Placeholder for now
        longest: 7, // Placeholder for now
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };
  
  // Navigate to log screens
  const navigateToFoodLog = () => navigation.navigate('FoodLog');
  const navigateToMoodLog = () => navigation.navigate('MoodLog');
  const navigateToExerciseLog = () => navigation.navigate('ExerciseLog');
  const navigateToSleepLog = () => navigation.navigate('SleepLog');
  const navigateToWaterLog = () => navigation.navigate('WaterLog');
  const navigateToInsights = () => navigation.navigate('Insights');
  
  // Update water intake
  const handleAddWater = async () => {
    const newAmount = todayData.water + 1;
    await updateWaterIntake(newAmount);
    setTodayData({ ...todayData, water: newAmount });
  };
  
  const handleSubtractWater = async () => {
    if (todayData.water > 0) {
      const newAmount = todayData.water - 1;
      await updateWaterIntake(newAmount);
      setTodayData({ ...todayData, water: newAmount });
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Dashboard" 
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="Profile"
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="user" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            {greeting}, {user?.name?.split(' ')[0] || 'there'}!
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>
        
        <View style={styles.streakContainer}>
          <View 
            style={[
              styles.streakCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Feather name="award" size={20} color={theme.primary} style={styles.streakIcon} />
            <View>
              <Text style={[styles.streakTitle, { color: theme.textSecondary }]}>
                Current Streak
              </Text>
              <Text style={[styles.streakValue, { color: theme.text }]}>
                {streaks.current} days
              </Text>
            </View>
          </View>
          
          <View 
            style={[
              styles.streakCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Feather name="trending-up" size={20} color={theme.primary} style={styles.streakIcon} />
            <View>
              <Text style={[styles.streakTitle, { color: theme.textSecondary }]}>
                Longest Streak
              </Text>
              <Text style={[styles.streakValue, { color: theme.text }]}>
                {streaks.longest} days
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Today's Logs
        </Text>
        
        <View style={styles.logsContainer}>
          <LogCard
            title="Food"
            icon="coffee"
            value={todayData.food ? `${todayData.food.totalCalories} cal` : "Not logged"}
            subtitle={todayData.food ? `${todayData.food.mealCount} meals today` : "Tap to log"}
            onPress={navigateToFoodLog}
            style={styles.logCard}
          />
          
          <LogCard
            title="Mood"
            icon="smile"
            value={todayData.mood ? todayData.mood.label : "Not logged"}
            subtitle={todayData.mood ? todayData.mood.notes || "How are you feeling?" : "Tap to log"}
            onPress={navigateToMoodLog}
            style={styles.logCard}
            valueColor={todayData.mood?.color}
          />
          
          <LogCard
            title="Exercise"
            icon="activity"
            value={todayData.exercise ? `${todayData.exercise.duration} mins` : "Not logged"}
            subtitle={todayData.exercise ? todayData.exercise.type : "Tap to log"}
            onPress={navigateToExerciseLog}
            style={styles.logCard}
          />
          
          <LogCard
            title="Sleep"
            icon="moon"
            value={todayData.sleep ? `${todayData.sleep.duration} hrs` : "Not logged"}
            subtitle={todayData.sleep ? `Quality: ${todayData.sleep.quality}` : "Tap to log"}
            onPress={navigateToSleepLog}
            style={styles.logCard}
          />
        </View>
        
        <WaterTracker
          currentAmount={todayData.water}
          goalAmount={DEFAULT_VALUES.WATER_GOAL}
          onAdd={handleAddWater}
          onSubtract={handleSubtractWater}
          style={styles.waterTracker}
        />
        
        <View style={styles.insightsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            AI Insights
          </Text>
          <TouchableOpacity
            onPress={navigateToInsights}
            style={styles.viewAllButton}
            accessibilityLabel="View all insights"
            accessibilityRole="button"
          >
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              View All
            </Text>
            <Feather name="chevron-right" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
        
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <InsightCard
              key={`insight-${index}`}
              insight={insight}
              style={index === insights.length - 1 ? { marginBottom: SPACING.md } : null}
            />
          ))
        ) : (
          <View 
            style={[
              styles.emptyInsights, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border
              }
            ]}
          >
            <Feather name="zap" size={24} color={theme.textSecondary} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No insights yet
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
              Log your health data regularly to get personalized insights.
            </Text>
          </View>
        )}
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
  greetingContainer: {
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: FONT_SIZES.md,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
  },
  streakIcon: {
    marginRight: SPACING.sm,
  },
  streakTitle: {
    fontSize: FONT_SIZES.xs,
    marginBottom: 2,
  },
  streakValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  logsContainer: {
    marginBottom: SPACING.md,
  },
  logCard: {
    marginBottom: SPACING.sm,
  },
  waterTracker: {
    marginBottom: SPACING.lg,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  viewAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyInsights: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  emptyIcon: {
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptyMessage: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
});

export default DashboardScreen;
