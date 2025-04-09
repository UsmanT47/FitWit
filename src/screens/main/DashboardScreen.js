import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { formatDate } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from '../../services/storageService';
import { generateDailyInsight } from '../../services/aiService';

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    food: [],
    mood: [],
    exercise: [],
    sleep: [],
    water: { glasses: 0, goal: 8 },
    date: formatDate(new Date()),
  });
  const [insights, setInsights] = useState([]);
  
  // Load user data and insights on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Load user data and insights
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get today's data
      const data = await getUserData();
      setUserData({
        ...data,
        water: data.water[0] || { glasses: 0, goal: 8 }
      });
      
      // Get insights
      const dailyInsights = await generateDailyInsight();
      setInsights(dailyInsights);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    let completed = 0;
    let total = 5; // Food, water, exercise, sleep, mood
    
    if (userData.food.length > 0) completed++;
    if (userData.water && userData.water.glasses > 0) completed++;
    if (userData.exercise.length > 0) completed++;
    if (userData.sleep.length > 0) completed++;
    if (userData.mood.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  // Navigate to log screen
  const navigateToLog = (logType) => {
    navigation.navigate('Log', { screen: `${logType}Log` });
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary.main]}
          tintColor={theme.primary.main}
        />
      }
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary.main} />
        </View>
      ) : (
        <>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View>
              <Text style={[styles.welcomeText, { color: theme.text.primary }]}>
                Hello, {user?.username || 'there'}!
              </Text>
              <Text style={[styles.dateText, { color: theme.text.secondary }]}>
                {formatDate(new Date(), 'EEEE, MMMM d')}
              </Text>
            </View>
            <View 
              style={[
                styles.completionBadge, 
                { backgroundColor: theme.primary.light }
              ]}
            >
              <Text style={[styles.completionText, { color: theme.primary.contrast }]}>
                {calculateCompletionPercentage()}% Complete
              </Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Quick Log
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigateToLog('Food')}
            >
              <Ionicons name="restaurant-outline" size={24} color={theme.text.primary} />
              <Text style={[styles.quickActionText, { color: theme.text.secondary }]}>Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigateToLog('Water')}
            >
              <Ionicons name="water-outline" size={24} color={theme.text.primary} />
              <Text style={[styles.quickActionText, { color: theme.text.secondary }]}>Water</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigateToLog('Exercise')}
            >
              <Ionicons name="fitness-outline" size={24} color={theme.text.primary} />
              <Text style={[styles.quickActionText, { color: theme.text.secondary }]}>Exercise</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigateToLog('Sleep')}
            >
              <Ionicons name="bed-outline" size={24} color={theme.text.primary} />
              <Text style={[styles.quickActionText, { color: theme.text.secondary }]}>Sleep</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigateToLog('Mood')}
            >
              <Ionicons name="happy-outline" size={24} color={theme.text.primary} />
              <Text style={[styles.quickActionText, { color: theme.text.secondary }]}>Mood</Text>
            </TouchableOpacity>
          </View>
          
          {/* Today's Summary */}
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Today's Summary
          </Text>
          <View style={[styles.summaryCard, { backgroundColor: theme.background.secondary }]}>
            {userData.food.length > 0 ? (
              <View style={styles.summaryItem}>
                <Ionicons name="restaurant" size={20} color={theme.text.primary} />
                <Text style={[styles.summaryText, { color: theme.text.primary }]}>
                  {userData.food.length} meals logged
                </Text>
              </View>
            ) : (
              <View style={styles.summaryItem}>
                <Ionicons name="restaurant-outline" size={20} color={theme.text.tertiary} />
                <Text style={[styles.summaryText, { color: theme.text.tertiary }]}>
                  No meals logged
                </Text>
              </View>
            )}
            
            {userData.water && userData.water.glasses > 0 ? (
              <View style={styles.summaryItem}>
                <Ionicons name="water" size={20} color={theme.text.primary} />
                <Text style={[styles.summaryText, { color: theme.text.primary }]}>
                  {userData.water.glasses} / {userData.water.goal} glasses of water
                </Text>
              </View>
            ) : (
              <View style={styles.summaryItem}>
                <Ionicons name="water-outline" size={20} color={theme.text.tertiary} />
                <Text style={[styles.summaryText, { color: theme.text.tertiary }]}>
                  No water intake logged
                </Text>
              </View>
            )}
            
            {userData.exercise.length > 0 ? (
              <View style={styles.summaryItem}>
                <Ionicons name="fitness" size={20} color={theme.text.primary} />
                <Text style={[styles.summaryText, { color: theme.text.primary }]}>
                  {userData.exercise.length} workouts logged
                </Text>
              </View>
            ) : (
              <View style={styles.summaryItem}>
                <Ionicons name="fitness-outline" size={20} color={theme.text.tertiary} />
                <Text style={[styles.summaryText, { color: theme.text.tertiary }]}>
                  No exercise logged
                </Text>
              </View>
            )}
            
            {userData.sleep.length > 0 ? (
              <View style={styles.summaryItem}>
                <Ionicons name="bed" size={20} color={theme.text.primary} />
                <Text style={[styles.summaryText, { color: theme.text.primary }]}>
                  Sleep logged
                </Text>
              </View>
            ) : (
              <View style={styles.summaryItem}>
                <Ionicons name="bed-outline" size={20} color={theme.text.tertiary} />
                <Text style={[styles.summaryText, { color: theme.text.tertiary }]}>
                  No sleep logged
                </Text>
              </View>
            )}
            
            {userData.mood.length > 0 ? (
              <View style={styles.summaryItem}>
                <Ionicons name="happy" size={20} color={theme.text.primary} />
                <Text style={[styles.summaryText, { color: theme.text.primary }]}>
                  Mood logged
                </Text>
              </View>
            ) : (
              <View style={styles.summaryItem}>
                <Ionicons name="happy-outline" size={20} color={theme.text.tertiary} />
                <Text style={[styles.summaryText, { color: theme.text.tertiary }]}>
                  No mood logged
                </Text>
              </View>
            )}
          </View>
          
          {/* Daily Insights */}
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Daily Insight
          </Text>
          {insights.length > 0 ? (
            <View style={[styles.insightCard, { backgroundColor: theme.background.accent }]}>
              <View style={styles.insightHeader}>
                <Ionicons name="bulb" size={24} color={theme.primary.main} />
                <Text style={[styles.insightTitle, { color: theme.text.primary }]}>
                  {insights[0].title}
                </Text>
              </View>
              <Text style={[styles.insightContent, { color: theme.text.secondary }]}>
                {insights[0].content}
              </Text>
            </View>
          ) : (
            <View style={[styles.emptyInsight, { backgroundColor: theme.background.secondary }]}>
              <Ionicons name="bulb-outline" size={24} color={theme.text.tertiary} />
              <Text style={[styles.emptyInsightText, { color: theme.text.tertiary }]}>
                Log more data to get personalized insights
              </Text>
            </View>
          )}
          
          {/* View All Insights Button */}
          <TouchableOpacity 
            style={[styles.viewAllButton, { borderColor: theme.primary.main }]}
            onPress={() => navigation.navigate('Insights')}
          >
            <Text style={[styles.viewAllText, { color: theme.primary.main }]}>
              View All Insights
            </Text>
            <Ionicons name="arrow-forward" size={16} color={theme.primary.main} />
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.LARGE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.LARGE,
    marginBottom: SPACING.MEDIUM,
  },
  welcomeText: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginTop: SPACING.TINY,
  },
  completionBadge: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.TINY,
    borderRadius: 20,
  },
  completionText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginTop: SPACING.LARGE,
    marginBottom: SPACING.MEDIUM,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SPACING.SMALL,
    marginBottom: SPACING.MEDIUM,
  },
  quickActionText: {
    fontSize: FONT_SIZES.TINY,
    marginTop: SPACING.TINY,
  },
  summaryCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  summaryText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginLeft: SPACING.SMALL,
  },
  insightCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  insightTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    marginLeft: SPACING.SMALL,
  },
  insightContent: {
    fontSize: FONT_SIZES.MEDIUM,
    lineHeight: 22,
  },
  emptyInsight: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: SPACING.MEDIUM,
  },
  emptyInsightText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginTop: SPACING.SMALL,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: SPACING.SMALL,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  viewAllText: {
    fontSize: FONT_SIZES.MEDIUM,
    marginRight: SPACING.SMALL,
    fontWeight: '500',
  },
});

export default DashboardScreen;