import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';
import { formatTime } from '../utils/dateUtils';

const LogCard = ({ 
  title, 
  icon, 
  value, 
  subtitle, 
  onPress, 
  style = {},
  valueColor
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={`Tap to log ${title.toLowerCase()}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Feather 
            name={icon} 
            size={18} 
            color={theme.primary} 
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={theme.textTertiary} />
      </View>
      
      <View style={styles.valueContainer}>
        <Text 
          style={[
            styles.value, 
            { color: valueColor || theme.text }
          ]}
        >
          {value}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.lastUpdated, { color: theme.textTertiary }]}>
          Last updated: {formatTime(new Date())}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  valueContainer: {
    marginVertical: SPACING.sm,
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    marginTop: SPACING.sm,
  },
  lastUpdated: {
    fontSize: FONT_SIZES.xs,
  },
});

export default LogCard;
