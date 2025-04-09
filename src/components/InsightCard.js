import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const InsightCard = ({ 
  insight, 
  style = {} 
}) => {
  const { theme } = useTheme();
  
  const getInsightIcon = () => {
    const title = insight.title?.toLowerCase() || '';
    
    if (title.includes('sleep')) return 'moon';
    if (title.includes('mood')) return 'smile';
    if (title.includes('exercise') || title.includes('activity')) return 'activity';
    if (title.includes('water') || title.includes('hydration')) return 'droplet';
    if (title.includes('food') || title.includes('nutrition')) return 'coffee';
    return 'zap';
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.cardBackground, 
          borderColor: theme.border
        },
        style
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Insight: ${insight.title}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.insightIconBackground }]}>
        <Feather 
          name={getInsightIcon()} 
          size={20} 
          color={theme.primary} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          {insight.title}
        </Text>
        
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {insight.description}
        </Text>
        
        {insight.date && (
          <Text style={[styles.date, { color: theme.textTertiary }]}>
            Based on data from {insight.date}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
});

export default InsightCard;
