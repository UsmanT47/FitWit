import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import InsightCard from '../../components/InsightCard';
import ProgressChart from '../../components/ProgressChart';
import EmptyState from '../../components/EmptyState';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { DEFAULT_VALUES, VISUALIZATION_CONFIG } from '../../constants/config';
import { formatDate } from '../../utils/dateUtils';
import { getAllInsights, generateNewInsight } from '../../services/aiService';
import { getHistoricalData } from '../../services/storageService';

const InsightsScreen = () => {
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({
    mood: [],
    sleep: [],
    water: [],
    exercise: [],
  });
  
  // Load insights and chart data on mount
  useEffect(() => {
    loadInsights();
    loadChartData();
  }, []);
  
  // Load insights based on active tab
  const loadInsights = async () => {
    try {
      const allInsights = await getAllInsights();
      
      // Filter insights based on active tab
      if (activeTab === 'all') {
        setInsights(allInsights);
      } else {
        const filteredInsights = allInsights.filter(insight => 
          insight.category?.toLowerCase() === activeTab.toLowerCase()
        );
        setInsights(filteredInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };
  
  // Load chart data based on time range
  const loadChartData = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      if (timeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setDate(endDate.getDate() - 30);
      } else {
        startDate.setDate(endDate.getDate() - 90);
      }
      
      // Format dates
      const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd');
      const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd');
      
      // Get historical data
      const historicalData = await getHistoricalData(formattedStartDate, formattedEndDate);
      
      // Process data for charts
      processMoodData(historicalData.mood);
      processSleepData(historicalData.sleep);
      processWaterData(historicalData.water);
      processExerciseData(historicalData.exercise);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };
  
  // Process mood data for chart
  const processMoodData = (data) => {
    if (!data || data.length === 0) {
      setChartData(prev => ({ ...prev, mood: [] }));
      return;
    }
    
    const chartData = data.map(item => ({
      x: new Date(item.date),
      y: item.value,
    }));
    
    setChartData(prev => ({ ...prev, mood: chartData }));
  };
  
  // Process sleep data for chart
  const processSleepData = (data) => {
    if (!data || data.length === 0) {
      setChartData(prev => ({ ...prev, sleep: [] }));
      return;
    }
    
    const chartData = data.map(item => ({
      x: new Date(item.date),
      y: item.duration,
    }));
    
    setChartData(prev => ({ ...prev, sleep: chartData }));
  };
  
  // Process water data for chart
  const processWaterData = (data) => {
    if (!data || data.length === 0) {
      setChartData(prev => ({ ...prev, water: [] }));
      return;
    }
    
    const chartData = data.map(item => ({
      x: new Date(item.date),
      y: item.glasses,
    }));
    
    setChartData(prev => ({ ...prev, water: chartData }));
  };
  
  // Process exercise data for chart
  const processExerciseData = (data) => {
    if (!data || data.length === 0) {
      setChartData(prev => ({ ...prev, exercise: [] }));
      return;
    }
    
    const chartData = data.map(item => ({
      x: new Date(item.date),
      y: item.duration,
    }));
    
    setChartData(prev => ({ ...prev, exercise: chartData }));
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadInsights(), loadChartData()]);
    setRefreshing(false);
  };
  
  // Change active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Change time range
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    loadChartData();
  };
  
  // Generate new insight
  const handleGenerateInsight = async () => {
    try {
      const newInsight = await generateNewInsight();
      if (newInsight) {
        setInsights([newInsight, ...insights]);
      }
    } catch (error) {
      console.error('Error generating insight:', error);
    }
  };
  
  // Render tab button
  const renderTabButton = (tab, label, icon) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        activeTab !== tab && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => handleTabChange(tab)}
      accessibilityLabel={`${label} insights tab`}
      accessibilityRole="tab"
      accessibilityState={{ selected: activeTab === tab }}
    >
      <Feather 
        name={icon} 
        size={16} 
        color={activeTab === tab ? '#fff' : theme.text} 
        style={styles.tabIcon}
      />
      <Text 
        style={[
          styles.tabText,
          { color: activeTab === tab ? '#fff' : theme.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Render time range button
  const renderTimeRangeButton = (range, label) => (
    <TouchableOpacity
      style={[
        styles.timeRangeButton,
        timeRange === range ? 
          { backgroundColor: theme.primary } : 
          { backgroundColor: 'transparent' }
      ]}
      onPress={() => handleTimeRangeChange(range)}
      accessibilityLabel={`${label} time range`}
      accessibilityRole="button"
      accessibilityState={{ selected: timeRange === range }}
    >
      <Text 
        style={[
          styles.timeRangeText,
          { color: timeRange === range ? '#fff' : theme.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader title="Insights" />
      
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
        <View style={styles.chartsContainer}>
          <View style={styles.chartsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Health Trends
            </Text>
            
            <View style={styles.timeRangeContainer}>
              {renderTimeRangeButton('week', 'Week')}
              {renderTimeRangeButton('month', 'Month')}
              {renderTimeRangeButton('quarter', '3 Months')}
            </View>
          </View>
          
          <ProgressChart
            data={chartData.mood}
            title="Mood Tracking"
            xAxisLabel="Date"
            yAxisLabel="Mood (1-5)"
            color={VISUALIZATION_CONFIG.CHART_COLORS.MOOD}
            emptyStateMessage="Log your mood to see trends"
          />
          
          <ProgressChart
            data={chartData.sleep}
            title="Sleep Duration"
            xAxisLabel="Date"
            yAxisLabel="Hours"
            color={VISUALIZATION_CONFIG.CHART_COLORS.SLEEP}
            emptyStateMessage="Log your sleep to see trends"
          />
          
          <ProgressChart
            data={chartData.water}
            title="Water Intake"
            xAxisLabel="Date"
            yAxisLabel="Glasses"
            color={VISUALIZATION_CONFIG.CHART_COLORS.WATER}
            emptyStateMessage="Log your water intake to see trends"
          />
          
          <ProgressChart
            data={chartData.exercise}
            title="Exercise Duration"
            xAxisLabel="Date"
            yAxisLabel="Minutes"
            color={VISUALIZATION_CONFIG.CHART_COLORS.EXERCISE}
            emptyStateMessage="Log your exercise to see trends"
          />
        </View>
        
        <View style={styles.insightsContainer}>
          <View style={styles.insightsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              AI Insights
            </Text>
            
            <TouchableOpacity
              style={[
                styles.generateButton,
                { backgroundColor: theme.primary }
              ]}
              onPress={handleGenerateInsight}
              accessibilityLabel="Generate new insight"
              accessibilityRole="button"
            >
              <Feather name="refresh-cw" size={16} color="#fff" style={styles.generateIcon} />
              <Text style={styles.generateText}>Generate</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabsContainer}>
            {renderTabButton('all', 'All', 'grid')}
            {renderTabButton('mood', 'Mood', 'smile')}
            {renderTabButton('sleep', 'Sleep', 'moon')}
            {renderTabButton('exercise', 'Exercise', 'activity')}
            {renderTabButton('nutrition', 'Nutrition', 'coffee')}
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
            <EmptyState
              icon="zap"
              title="No Insights Yet"
              message="Log your health data regularly to get personalized insights."
              buttonTitle="Generate Insight"
              onButtonPress={handleGenerateInsight}
            />
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  chartsContainer: {
    marginBottom: SPACING.lg,
  },
  chartsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 3,
  },
  timeRangeButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeRangeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  insightsContainer: {
    marginBottom: SPACING.lg,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 16,
  },
  generateIcon: {
    marginRight: 4,
  },
  generateText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
});

export default InsightsScreen;
