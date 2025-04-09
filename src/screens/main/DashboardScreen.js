import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { generateDailyInsight } from '../../services/aiService';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [todayStats, setTodayStats] = useState({
    water: { current: 750, goal: 2000 }, // ml
    steps: { current: 4320, goal: 10000 },
    calories: { current: 1200, goal: 2000 },
    sleep: { current: 7, goal: 8 }, // hours
  });
  
  useEffect(() => {
    loadInsights();
  }, []);
  
  const loadInsights = async () => {
    try {
      const dailyInsights = await generateDailyInsight();
      setInsights(dailyInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInsights();
    } finally {
      setRefreshing(false);
    }
  };
  
  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Morning';
    if (hours < 18) return 'Afternoon';
    return 'Evening';
  };
  
  const renderProgressBar = (current, goal, color) => {
    const progress = Math.min(current / goal, 1);
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { backgroundColor: theme.background.tertiary }
          ]}
        >
          <View 
            style={[
              styles.progress, 
              { 
                width: `${progress * 100}%`,
                backgroundColor: color
              }
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.text.primary }]}>
          {current}/{goal}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text.primary }]}>
              Good {getTimeOfDay()}, {user?.name || 'Friend'}!
            </Text>
            <Text style={[styles.date, { color: theme.text.secondary }]}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: theme.background.secondary }]}
          >
            <Text style={[styles.profileInitial, { color: theme.primary.main }]}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Today's Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.background.secondary }]}>
          <Text style={[styles.cardTitle, { color: theme.text.primary }]}>Today's Progress</Text>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="water-outline" size={20} color={theme.info.main} />
              <Text style={[styles.statTitle, { color: theme.text.primary }]}>Water</Text>
            </View>
            {renderProgressBar(todayStats.water.current, todayStats.water.goal, theme.info.main)}
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="footsteps-outline" size={20} color={theme.success.main} />
              <Text style={[styles.statTitle, { color: theme.text.primary }]}>Steps</Text>
            </View>
            {renderProgressBar(todayStats.steps.current, todayStats.steps.goal, theme.success.main)}
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="flame-outline" size={20} color={theme.error.main} />
              <Text style={[styles.statTitle, { color: theme.text.primary }]}>Calories</Text>
            </View>
            {renderProgressBar(todayStats.calories.current, todayStats.calories.goal, theme.error.main)}
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="moon-outline" size={20} color={theme.secondary.main} />
              <Text style={[styles.statTitle, { color: theme.text.primary }]}>Sleep</Text>
            </View>
            {renderProgressBar(todayStats.sleep.current, todayStats.sleep.goal, theme.secondary.main)}
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Log</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="water" size={24} color={theme.info.main} />
              <Text style={[styles.actionText, { color: theme.text.primary }]}>Water</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="fast-food" size={24} color={theme.error.main} />
              <Text style={[styles.actionText, { color: theme.text.primary }]}>Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="barbell" size={24} color={theme.success.main} />
              <Text style={[styles.actionText, { color: theme.text.primary }]}>Exercise</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
            >
              <Ionicons name="happy" size={24} color={theme.warning.main} />
              <Text style={[styles.actionText, { color: theme.text.primary }]}>Mood</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Daily Insights */}
        <View style={styles.insights}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Daily Insight</Text>
          
          {insights.length > 0 ? (
            insights.map((insight) => (
              <View
                key={insight.id}
                style={[styles.insightCard, { backgroundColor: theme.background.secondary }]}
              >
                <Text style={[styles.insightTitle, { color: theme.text.primary }]}>
                  {insight.title}
                </Text>
                <Text style={[styles.insightContent, { color: theme.text.secondary }]}>
                  {insight.content}
                </Text>
              </View>
            ))
          ) : (
            <View style={[styles.insightCard, { backgroundColor: theme.background.secondary }]}>
              <Text style={[styles.insightTitle, { color: theme.text.primary }]}>
                Track Your Health
              </Text>
              <Text style={[styles.insightContent, { color: theme.text.secondary }]}>
                Start logging your health data to receive personalized insights and recommendations.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statItem: {
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    width: 70,
    textAlign: 'right',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 8,
  },
  insights: {
    marginBottom: 24,
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;