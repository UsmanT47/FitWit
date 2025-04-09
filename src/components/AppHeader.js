import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const AppHeader = ({ title, showBackButton = false, rightComponent = null }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.headerBackground }
    ]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text 
        style={[styles.title, { color: theme.text }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default AppHeader;
