import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getAllInsights, generateNewInsight } from '../../services/aiService';

const InsightsScreen = () => {
  const { theme } = useTheme();
  const [insights, setInsights] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingNewInsight, setGeneratingNewInsight] = useState(false);
  
  useEffect(() => {
    loadInsights();
  }, []);
  
  const loadInsights = async () => {
    try {
      setLoading(true);
      const insightData = await getAllInsights();
      setInsights(insightData);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
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
  
  const handleGenerateNewInsight = async () => {
    try {
      setGeneratingNewInsight(true);
      const newInsight = await generateNewInsight();
      setInsights(prevInsights => [newInsight, ...prevInsights]);
    } catch (error) {
      console.error('Error generating new insight:', error);
    } finally {
      setGeneratingNewInsight(false);
    }
  };
  
  const getInsightIcon = (type) => {
    switch(type) {
      case 'sleep':
        return <Ionicons name="moon" size={24} color={theme.secondary.main} />;
      case 'nutrition':
        return <Ionicons name="nutrition" size={24} color={theme.error.main} />;
      case 'exercise':
        return <Ionicons name="barbell" size={24} color={theme.success.main} />;
      case 'hydration':
        return <Ionicons name="water" size={24} color={theme.info.main} />;
      case 'mood':
        return <Ionicons name="happy" size={24} color={theme.warning.main} />;
      default:
        return <Ionicons name="bulb" size={24} color={theme.primary.main} />;
    }
  };
  
  const renderInsightCard = (insight) => {
    return (
      <View
        key={insight.id}
        style={[styles.insightCard, { backgroundColor: theme.background.secondary }]}
      >
        <View style={styles.insightHeader}>
          {getInsightIcon(insight.type)}
          <View style={styles.insightTitleContainer}>
            <Text style={[styles.insightTitle, { color: theme.text.primary }]}>
              {insight.title}
            </Text>
            <Text style={[styles.insightDate, { color: theme.text.tertiary }]}>
              {new Date(insight.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={[styles.insightContent, { color: theme.text.secondary }]}>
          {insight.content}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={theme.isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Health Insights</Text>
        <TouchableOpacity
          style={[
            styles.newInsightButton, 
            { backgroundColor: theme.primary.main },
            generatingNewInsight && { opacity: 0.7 }
          ]}
          onPress={handleGenerateNewInsight}
          disabled={generatingNewInsight}
        >
          {generatingNewInsight ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="bulb-outline" size={16} color="#FFF" />
              <Text style={styles.newInsightText}>New Insight</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary.main} />
            <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
              Loading insights...
            </Text>
          </View>
        ) : insights.length > 0 ? (
          insights.map(renderInsightCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={64} color={theme.text.tertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
              No Insights Yet
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.text.secondary }]}>
              Start logging your health data to receive personalized insights about your well-being.
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newInsightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newInsightText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightDate: {
    fontSize: 12,
  },
  insightContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default InsightsScreen;