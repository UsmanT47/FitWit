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
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { getAllInsights, generateNewInsight } from '../../services/aiService';

const InsightsScreen = () => {
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [insights, setInsights] = useState([]);
  
  // Load insights on mount
  useEffect(() => {
    loadInsights();
  }, []);
  
  // Load user insights
  const loadInsights = async () => {
    try {
      setIsLoading(true);
      const data = await getAllInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };
  
  // Generate a new insight
  const handleGenerateInsight = async () => {
    try {
      setLoadingNew(true);
      const newInsight = await generateNewInsight();
      setInsights([newInsight, ...insights]);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setLoadingNew(false);
    }
  };
  
  // Get insight icon based on type
  const getInsightIcon = (type) => {
    switch (type) {
      case 'sleep':
        return 'bed';
      case 'nutrition':
        return 'restaurant';
      case 'exercise':
        return 'fitness';
      case 'mood':
        return 'happy';
      case 'hydration':
        return 'water';
      case 'general':
      default:
        return 'bulb';
    }
  };
  
  // Get insight color based on type
  const getInsightColor = (type) => {
    switch (type) {
      case 'sleep':
        return theme.info.main;
      case 'nutrition':
        return theme.success.main;
      case 'exercise':
        return theme.secondary.main;
      case 'mood':
        return theme.warning.main;
      case 'hydration':
        return theme.info.light;
      case 'general':
      default:
        return theme.primary.main;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Header with Generate Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Your Health Insights
        </Text>
        <TouchableOpacity 
          style={[
            styles.generateButton, 
            { 
              backgroundColor: loadingNew 
                ? theme.background.secondary 
                : theme.primary.main 
            }
          ]}
          onPress={handleGenerateInsight}
          disabled={loadingNew}
        >
          {loadingNew ? (
            <ActivityIndicator size="small" color={theme.primary.main} />
          ) : (
            <>
              <Ionicons name="add" size={16} color={theme.primary.contrast} />
              <Text style={[styles.generateText, { color: theme.primary.contrast }]}>
                New Insight
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Insights List */}
      <ScrollView
        style={styles.scrollView}
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
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <View 
              key={insight.id || index}
              style={[
                styles.insightCard,
                { backgroundColor: theme.background.secondary }
              ]}
            >
              <View style={styles.insightHeader}>
                <View 
                  style={[
                    styles.iconContainer, 
                    { backgroundColor: getInsightColor(insight.type) }
                  ]}
                >
                  <Ionicons 
                    name={getInsightIcon(insight.type)} 
                    size={20} 
                    color={theme.background.primary} 
                  />
                </View>
                <View style={styles.insightMeta}>
                  <Text style={[styles.insightTitle, { color: theme.text.primary }]}>
                    {insight.title}
                  </Text>
                  <Text style={[styles.insightDate, { color: theme.text.tertiary }]}>
                    {formatRelativeTime(insight.createdAt)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.insightContent, { color: theme.text.secondary }]}>
                {insight.content}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="analytics-outline" 
              size={60} 
              color={theme.text.tertiary} 
            />
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              No insights available yet. Log your health data consistently to receive personalized insights.
            </Text>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: theme.primary.main }]}
              onPress={handleGenerateInsight}
            >
              <Text style={[styles.refreshText, { color: theme.primary.contrast }]}>
                Generate Insight
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.LARGE,
    paddingBottom: SPACING.MEDIUM,
  },
  title: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: 'bold',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: SPACING.MEDIUM,
  },
  generateText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '500',
    marginLeft: SPACING.TINY,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.LARGE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  insightCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightMeta: {
    flex: 1,
    marginLeft: SPACING.MEDIUM,
  },
  insightTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  insightDate: {
    fontSize: FONT_SIZES.SMALL,
    marginTop: 2,
  },
  insightContent: {
    fontSize: FONT_SIZES.MEDIUM,
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.XLARGE,
    minHeight: 400,
  },
  emptyText: {
    fontSize: FONT_SIZES.MEDIUM,
    textAlign: 'center',
    marginTop: SPACING.LARGE,
    marginBottom: SPACING.LARGE,
  },
  refreshButton: {
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
  },
  refreshText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '500',
  },
});

export default InsightsScreen;