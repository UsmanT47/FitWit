import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES, LAYOUT } from '../../constants/dimensions';

const LogOption = ({ title, icon, color, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.logOption, { backgroundColor: theme.background.secondary }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.logOptionText, { color: theme.text.primary }]}>
        {title}
      </Text>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={theme.text.tertiary} 
        style={styles.arrowIcon} 
      />
    </TouchableOpacity>
  );
};

const LogScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const logOptions = [
    {
      id: 'food',
      title: 'Food',
      icon: 'fast-food-outline',
      color: theme.chart.primary,
      onPress: () => navigation.navigate('FoodLog'),
    },
    {
      id: 'exercise',
      title: 'Exercise',
      icon: 'fitness-outline',
      color: theme.status.success,
      onPress: () => navigation.navigate('ExerciseLog'),
    },
    {
      id: 'water',
      title: 'Water',
      icon: 'water-outline',
      color: theme.chart.primary,
      onPress: () => navigation.navigate('WaterLog'),
    },
    {
      id: 'sleep',
      title: 'Sleep',
      icon: 'moon-outline',
      color: theme.mood.calm,
      onPress: () => navigation.navigate('SleepLog'),
    },
    {
      id: 'mood',
      title: 'Mood',
      icon: 'happy-outline',
      color: theme.status.warning,
      onPress: () => navigation.navigate('MoodLog'),
    },
    {
      id: 'health',
      title: 'Health Metrics',
      icon: 'pulse-outline',
      color: theme.status.error,
      onPress: () => navigation.navigate('HealthLog'),
    },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Log Your Health Data
      </Text>
      <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
        Track your health metrics to get personalized insights
      </Text>
      
      <ScrollView 
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
        showsVerticalScrollIndicator={false}
      >
        {logOptions.map((option) => (
          <LogOption
            key={option.id}
            title={option.title}
            icon={option.icon}
            color={option.color}
            onPress={option.onPress}
          />
        ))}
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
          onPress={() => navigation.navigate('ScanBarcode')}
        >
          <Ionicons name="barcode-outline" size={24} color={theme.text.accent} />
          <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
            Scan Barcode
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.background.secondary }]}
          onPress={() => {}}
        >
          <Ionicons name="mic-outline" size={24} color={theme.text.accent} />
          <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
            Voice Input
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.MEDIUM,
  },
  title: {
    fontSize: FONT_SIZES.HEADING_3,
    fontWeight: '600',
    marginBottom: SPACING.EXTRA_SMALL,
  },
  subtitle: {
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.LARGE,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    paddingBottom: SPACING.MEDIUM,
  },
  logOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    marginBottom: SPACING.MEDIUM,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  logOptionText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '500',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: SPACING.SMALL,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.SMALL,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    flex: 0.48,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '500',
    marginLeft: SPACING.SMALL,
  },
});

export default LogScreen;