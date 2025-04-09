import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES, SCREEN_WIDTH } from '../../constants/dimensions';
import { STORAGE_KEYS } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Function to handle skipping onboarding
  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      navigation.replace('Login');
    }
  };
  
  // Function to go to the login screen
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      navigation.replace('Login');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.text.secondary }]}>Skip</Text>
      </TouchableOpacity>
      
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Slide 1 */}
        <View style={styles.slide}>
          <Image 
            source={require('../../../assets/onboarding-1.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Track Your Health
          </Text>
          <Text style={[styles.description, { color: theme.text.secondary }]}>
            Log your food, exercise, sleep, and more to get a complete picture of your health.
          </Text>
        </View>
        
        {/* Slide 2 */}
        <View style={styles.slide}>
          <Image 
            source={require('../../../assets/onboarding-2.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Get Personalized Insights
          </Text>
          <Text style={[styles.description, { color: theme.text.secondary }]}>
            Our AI-powered system analyzes your data to provide personalized health insights and recommendations.
          </Text>
        </View>
        
        {/* Slide 3 */}
        <View style={styles.slide}>
          <Image 
            source={require('../../../assets/onboarding-3.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Achieve Your Goals
          </Text>
          <Text style={[styles.description, { color: theme.text.secondary }]}>
            Set health goals and track your progress to stay motivated and achieve results.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary.main }]}
          onPress={handleGetStarted}
        >
          <Text style={[styles.buttonText, { color: theme.primary.contrast }]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: SPACING.LARGE,
    zIndex: 1,
  },
  skipText: {
    fontSize: FONT_SIZES.REGULAR,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    marginBottom: SPACING.LARGE,
  },
  title: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  description: {
    fontSize: FONT_SIZES.REGULAR,
    textAlign: 'center',
    marginHorizontal: SPACING.LARGE,
  },
  footer: {
    padding: SPACING.LARGE,
  },
  button: {
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
    borderRadius: SPACING.MEDIUM,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;