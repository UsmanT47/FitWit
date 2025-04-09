import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const WaterTracker = ({
  currentAmount = 0,
  goalAmount = 8,
  onAdd,
  onSubtract,
  style = {}
}) => {
  const { theme } = useTheme();
  
  // Calculate progress percentage
  const progress = Math.min(currentAmount / goalAmount, 1);
  const progressPercent = Math.round(progress * 100);
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 0.5) return theme.waterProgress.low;
    if (progress < 0.8) return theme.waterProgress.medium;
    return theme.waterProgress.high;
  };
  
  const progressColor = getProgressColor();
  
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
      accessibilityLabel={`Water tracker: ${currentAmount} of ${goalAmount} glasses`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: goalAmount, now: currentAmount }}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Feather name="droplet" size={18} color={progressColor} style={styles.icon} />
          <Text style={[styles.title, { color: theme.text }]}>
            Water Intake
          </Text>
        </View>
        <Text style={[styles.progressText, { color: progressColor }]}>
          {progressPercent}%
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.progressBarBackground,
              width: '100%'
            }
          ]}
        >
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: progressColor,
                width: `${progressPercent}%`
              }
            ]}
          />
        </View>
      </View>
      
      <View style={styles.contentRow}>
        <View style={styles.amountContainer}>
          <Text style={[styles.currentAmount, { color: theme.text }]}>
            {currentAmount}
            <Text style={[styles.unit, { color: theme.textSecondary }]}>
              {' '}/ {goalAmount} glasses
            </Text>
          </Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              { 
                backgroundColor: theme.waterControlBackground,
                borderColor: theme.border
              }
            ]}
            onPress={onSubtract}
            disabled={currentAmount <= 0}
            accessibilityLabel="Decrease water intake"
            accessibilityRole="button"
            accessibilityHint="Reduces water intake by one glass"
          >
            <Feather 
              name="minus" 
              size={18} 
              color={currentAmount <= 0 ? theme.textTertiary : theme.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.controlButton,
              { 
                backgroundColor: theme.waterControlBackground,
                borderColor: theme.border,
                marginLeft: SPACING.sm
              }
            ]}
            onPress={onAdd}
            accessibilityLabel="Increase water intake"
            accessibilityRole="button"
            accessibilityHint="Adds one glass to water intake"
          >
            <Feather name="plus" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginVertical: SPACING.sm,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  amountContainer: {},
  currentAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  unit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default WaterTracker;
