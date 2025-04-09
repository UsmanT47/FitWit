import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const FoodItem = ({
  item,
  onPress,
  onDelete,
  showDetails = false,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Food item: ${item.food_name}`}
      accessibilityHint="Tap to view details"
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <Feather name="coffee" size={24} color={theme.primary} />
        </View>
      </View>
      
      <View style={styles.centerContainer}>
        <Text 
          style={[styles.foodName, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.food_name}
        </Text>
        
        <Text 
          style={[styles.brandName, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {item.brand_name || 'Generic'} • {item.serving_qty} {item.serving_unit}
        </Text>
        
        {showDetails && (
          <View style={styles.nutritionContainer}>
            <NutritionBadge 
              label="Protein"
              value={`${Math.round(item.nf_protein || 0)}g`}
              theme={theme}
            />
            <NutritionBadge 
              label="Carbs"
              value={`${Math.round(item.nf_total_carbohydrate || 0)}g`}
              theme={theme}
            />
            <NutritionBadge 
              label="Fat"
              value={`${Math.round(item.nf_total_fat || 0)}g`}
              theme={theme}
            />
          </View>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={[styles.calories, { color: theme.text }]}>
          {Math.round(item.nf_calories || 0)}
          <Text style={[styles.caloriesUnit, { color: theme.textSecondary }]}> cal</Text>
        </Text>
        
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityLabel={`Delete ${item.food_name}`}
            accessibilityRole="button"
            accessibilityHint="Removes this food item from your log"
          >
            <Feather name="trash-2" size={16} color={theme.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const NutritionBadge = ({ label, value, theme }) => (
  <View style={styles.badgeContainer}>
    <Text style={[styles.badgeValue, { color: theme.text }]}>
      {value}
    </Text>
    <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContainer: {
    marginRight: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  brandName: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  nutritionContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  badgeContainer: {
    marginRight: SPACING.md,
    alignItems: 'center',
  },
  badgeValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  badgeLabel: {
    fontSize: FONT_SIZES.xs,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: SPACING.sm,
  },
  calories: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  caloriesUnit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
});

export default FoodItem;
