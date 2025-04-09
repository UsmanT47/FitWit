import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate } from '../utils/dateUtils';
import { getUserData, getHistoricalData } from './storageService';
import { FEATURES, DEFAULT_VALUES } from '../constants/config';

// Sample patterns to look for in data
const CORRELATION_PATTERNS = [
  { 
    id: 'mood-exercise',
    pattern: 'moodAfterExercise', 
    description: 'You tend to feel {{sentiment}} on days you exercise.'
  },
  { 
    id: 'sleep-mood',
    pattern: 'sleepAffectsMood', 
    description: 'Your mood is {{sentiment}} when you get {{hours}} or more hours of sleep.'
  },
  { 
    id: 'water-energy',
    pattern: 'hydrationEnergy', 
    description: 'Drinking {{amount}} or more glasses of water seems to improve your energy levels.'
  },
  { 
    id: 'evening-routine',
    pattern: 'eveningRoutine', 
    description: 'Going to bed before {{time}} leads to better sleep quality.'
  },
  { 
    id: 'breakfast-energy',
    pattern: 'breakfastEnergy', 
    description: 'Having breakfast before {{time}} correlates with higher energy throughout the day.'
  },
];

/**
 * Generate AI insights from user health data
 * @returns {Array} Array of insight objects
 */
export const getAllInsights = async () => {
  try {
    if (!FEATURES.ENABLE_AI_INSIGHTS) {
      return getSampleInsights();
    }
    
    // Get stored insights
    const storedInsightsJson = await AsyncStorage.getItem('insights');
    let insights = [];
    
    if (storedInsightsJson) {
      insights = JSON.parse(storedInsightsJson);
    }
    
    // If we have fewer than 3 insights, generate some
    if (!insights || insights.length < 3) {
      const newInsights = await generateInitialInsights();
      insights = [...(insights || []), ...newInsights];
      await AsyncStorage.setItem('insights', JSON.stringify(insights));
    }
    
    return insights;
  } catch (error) {
    console.error('Error getting insights:', error);
    return [];
  }
};

/**
 * Generate a new insight on demand
 * @returns {Object} Newly generated insight
 */
export const generateNewInsight = async () => {
  try {
    if (!FEATURES.ENABLE_AI_INSIGHTS) {
      return generateSampleInsight();
    }
    
    const insight = await analyzeUserDataForInsight();
    
    if (insight) {
      // Store the new insight
      const storedInsightsJson = await AsyncStorage.getItem('insights');
      let insights = [];
      
      if (storedInsightsJson) {
        insights = JSON.parse(storedInsightsJson);
      }
      
      insights.unshift(insight);
      await AsyncStorage.setItem('insights', JSON.stringify(insights));
      
      return insight;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating new insight:', error);
    return null;
  }
};

/**
 * Generate an insight for the daily dashboard
 * @returns {Array} Array of insight objects for the dashboard
 */
export const generateDailyInsight = async () => {
  try {
    if (!FEATURES.ENABLE_AI_INSIGHTS) {
      return [generateSampleInsight()];
    }
    
    const storedInsightsJson = await AsyncStorage.getItem('insights');
    let insights = [];
    
    if (storedInsightsJson) {
      insights = JSON.parse(storedInsightsJson);
      
      // Return the most recent insight if it exists
      if (insights.length > 0) {
        return [insights[0]];
      }
    }
    
    // Generate a new insight if none exist
    const newInsight = await analyzeUserDataForInsight();
    
    if (newInsight) {
      // Store the new insight
      insights.unshift(newInsight);
      await AsyncStorage.setItem('insights', JSON.stringify(insights));
      
      return [newInsight];
    }
    
    return [generateSampleInsight()];
  } catch (error) {
    console.error('Error generating daily insight:', error);
    return [generateSampleInsight()];
  }
};

// Private methods

/**
 * Generate initial insights for a new user
 * @returns {Array} Array of initial insight objects
 */
const generateInitialInsights = async () => {
  const insights = [];
  
  // Generate welcome insight
  insights.push({
    id: 'welcome-' + Date.now(),
    title: 'Welcome to FitWit!',
    description: 'Track your daily habits to get personalized health insights over time.',
    category: 'general',
    date: formatDate(new Date(), 'MMM dd, yyyy'),
  });
  
  // Add some starter insights
  insights.push({
    id: 'starter-1-' + Date.now(),
    title: 'Start Your Health Journey',
    description: 'Log your food, exercise, sleep, and mood regularly to see patterns emerge.',
    category: 'general',
    date: formatDate(new Date(), 'MMM dd, yyyy'),
  });
  
  insights.push({
    id: 'starter-2-' + Date.now(),
    title: 'Hydration Tip',
    description: 'Drinking 8 glasses of water daily can boost energy and improve skin health.',
    category: 'nutrition',
    date: formatDate(new Date(), 'MMM dd, yyyy'),
  });
  
  return insights;
};

/**
 * Analyze user data to generate a personalized insight
 * @returns {Object} Generated insight
 */
const analyzeUserDataForInsight = async () => {
  try {
    // Get user data for analysis
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DEFAULT_VALUES.INSIGHTS_DATE_RANGE);
    
    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd');
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd');
    
    const historicalData = await getHistoricalData(formattedStartDate, formattedEndDate);
    
    // Not enough data yet
    if (!historicalData || !hasEnoughDataForAnalysis(historicalData)) {
      return generateSampleInsight();
    }
    
    // Analyze sleep patterns and their effect on mood
    if (historicalData.sleep && historicalData.sleep.length > 3 && 
        historicalData.mood && historicalData.mood.length > 3) {
      const sleepMoodInsight = analyzeSleepMoodCorrelation(historicalData.sleep, historicalData.mood);
      if (sleepMoodInsight) return sleepMoodInsight;
    }
    
    // Analyze exercise patterns and their effect on mood
    if (historicalData.exercise && historicalData.exercise.length > 3 && 
        historicalData.mood && historicalData.mood.length > 3) {
      const exerciseMoodInsight = analyzeExerciseMoodCorrelation(historicalData.exercise, historicalData.mood);
      if (exerciseMoodInsight) return exerciseMoodInsight;
    }
    
    // Analyze water intake patterns
    if (historicalData.water && historicalData.water.length > 5) {
      const waterInsight = analyzeWaterPatterns(historicalData.water);
      if (waterInsight) return waterInsight;
    }
    
    // Fall back to a general insight if no specific patterns found
    return generateSampleInsight();
  } catch (error) {
    console.error('Error analyzing data for insight:', error);
    return generateSampleInsight();
  }
};

/**
 * Check if there's enough data for meaningful analysis
 * @param {Object} data Historical user data
 * @returns {Boolean} True if enough data exists
 */
const hasEnoughDataForAnalysis = (data) => {
  const dataPoints = [
    ...(data.food || []),
    ...(data.mood || []),
    ...(data.exercise || []),
    ...(data.sleep || []),
    ...(data.water || [])
  ];
  
  return dataPoints.length >= 5;
};

/**
 * Analyze correlation between sleep and mood
 * @param {Array} sleepData Array of sleep records
 * @param {Array} moodData Array of mood records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeSleepMoodCorrelation = (sleepData, moodData) => {
  try {
    // Map sleep data by date
    const sleepByDate = sleepData.reduce((acc, sleep) => {
      acc[sleep.date] = sleep;
      return acc;
    }, {});
    
    // Map mood data by date
    const moodByDate = moodData.reduce((acc, mood) => {
      acc[mood.date] = mood;
      return acc;
    }, {});
    
    // Find dates that have both sleep and mood data
    const commonDates = Object.keys(sleepByDate).filter(date => moodByDate[date]);
    
    if (commonDates.length < 3) return null;
    
    // Separate into good sleep (>= 7 hours) and poor sleep (< 7 hours)
    const goodSleepMoods = [];
    const poorSleepMoods = [];
    
    commonDates.forEach(date => {
      const sleep = sleepByDate[date];
      const mood = moodByDate[date];
      
      if (sleep.duration >= 7) {
        goodSleepMoods.push(mood.value);
      } else {
        poorSleepMoods.push(mood.value);
      }
    });
    
    // Calculate average mood for good and poor sleep
    const avgGoodSleepMood = goodSleepMoods.length > 0 
      ? goodSleepMoods.reduce((sum, val) => sum + val, 0) / goodSleepMoods.length 
      : 0;
    
    const avgPoorSleepMood = poorSleepMoods.length > 0 
      ? poorSleepMoods.reduce((sum, val) => sum + val, 0) / poorSleepMoods.length 
      : 0;
    
    // If there's a significant difference in mood based on sleep
    if (Math.abs(avgGoodSleepMood - avgPoorSleepMood) >= 0.5 && goodSleepMoods.length >= 2 && poorSleepMoods.length >= 2) {
      return {
        id: 'sleep-mood-' + Date.now(),
        title: 'Sleep Pattern',
        description: avgGoodSleepMood > avgPoorSleepMood 
          ? 'You tend to have a better mood on days after you get 7 or more hours of sleep.'
          : 'Interestingly, your mood doesn\'t seem to be negatively affected by less sleep.',
        category: 'sleep',
        date: formatDate(new Date(), 'MMM dd, yyyy'),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing sleep-mood correlation:', error);
    return null;
  }
};

/**
 * Analyze correlation between exercise and mood
 * @param {Array} exerciseData Array of exercise records
 * @param {Array} moodData Array of mood records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeExerciseMoodCorrelation = (exerciseData, moodData) => {
  try {
    // Get unique dates for exercise data
    const exerciseDates = [...new Set(exerciseData.map(item => item.date))];
    
    // Map mood data by date
    const moodByDate = moodData.reduce((acc, mood) => {
      acc[mood.date] = mood;
      return acc;
    }, {});
    
    // Get moods on exercise days vs non-exercise days
    const exerciseDayMoods = [];
    const nonExerciseDayMoods = [];
    
    // For each date that has mood data, check if it's an exercise day
    Object.keys(moodByDate).forEach(date => {
      if (exerciseDates.includes(date)) {
        exerciseDayMoods.push(moodByDate[date].value);
      } else {
        nonExerciseDayMoods.push(moodByDate[date].value);
      }
    });
    
    // Calculate average moods
    const avgExerciseDayMood = exerciseDayMoods.length > 0
      ? exerciseDayMoods.reduce((sum, val) => sum + val, 0) / exerciseDayMoods.length
      : 0;
    
    const avgNonExerciseDayMood = nonExerciseDayMoods.length > 0
      ? nonExerciseDayMoods.reduce((sum, val) => sum + val, 0) / nonExerciseDayMoods.length
      : 0;
    
    // If there's a significant difference in mood based on exercise
    if (Math.abs(avgExerciseDayMood - avgNonExerciseDayMood) >= 0.5 && exerciseDayMoods.length >= 2 && nonExerciseDayMoods.length >= 2) {
      return {
        id: 'exercise-mood-' + Date.now(),
        title: 'Exercise & Mood',
        description: avgExerciseDayMood > avgNonExerciseDayMood
          ? 'Your mood tends to be better on days you exercise.'
          : 'You seem to have better moods on days you don\'t exercise. Consider if your exercise routine is too strenuous.',
        category: 'exercise',
        date: formatDate(new Date(), 'MMM dd, yyyy'),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing exercise-mood correlation:', error);
    return null;
  }
};

/**
 * Analyze water intake patterns
 * @param {Array} waterData Array of water intake records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeWaterPatterns = (waterData) => {
  try {
    if (waterData.length < 5) return null;
    
    // Calculate average water intake
    const totalGlasses = waterData.reduce((sum, item) => sum + item.glasses, 0);
    const avgGlasses = totalGlasses / waterData.length;
    
    // Count how many days the goal was met
    const goalMetCount = waterData.filter(item => item.glasses >= DEFAULT_VALUES.WATER_GOAL).length;
    const goalMetPercentage = (goalMetCount / waterData.length) * 100;
    
    if (goalMetPercentage >= 75) {
      return {
        id: 'water-consistent-' + Date.now(),
        title: 'Hydration Streak',
        description: `Great job! You've met your water intake goal on ${Math.round(goalMetPercentage)}% of tracked days.`,
        category: 'hydration',
        date: formatDate(new Date(), 'MMM dd, yyyy'),
      };
    } else if (goalMetPercentage <= 30 && waterData.length >= 7) {
      return {
        id: 'water-reminder-' + Date.now(),
        title: 'Hydration Reminder',
        description: `You're meeting your water intake goal only ${Math.round(goalMetPercentage)}% of the time. Try setting reminders to drink more water.`,
        category: 'hydration',
        date: formatDate(new Date(), 'MMM dd, yyyy'),
      };
    } else if (avgGlasses < DEFAULT_VALUES.WATER_GOAL * 0.6) {
      return {
        id: 'water-low-' + Date.now(),
        title: 'Increase Hydration',
        description: `Your average water intake is ${avgGlasses.toFixed(1)} glasses, below your goal of ${DEFAULT_VALUES.WATER_GOAL} glasses. Proper hydration improves energy and focus.`,
        category: 'hydration',
        date: formatDate(new Date(), 'MMM dd, yyyy'),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error analyzing water patterns:', error);
    return null;
  }
};

/**
 * Generate a sample insight for testing/placeholder
 * @returns {Object} Sample insight
 */
const generateSampleInsight = () => {
  const insights = getSampleInsights();
  const randomIndex = Math.floor(Math.random() * insights.length);
  return insights[randomIndex];
};

/**
 * Get a set of sample insights
 * @returns {Array} Array of sample insights
 */
const getSampleInsights = () => {
  return [
    {
      id: 'sample-1',
      title: 'Sleep Pattern',
      description: 'You sleep better on days you exercise.',
      category: 'sleep',
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    },
    {
      id: 'sample-2',
      title: 'Mood Correlation',
      description: 'Your mood improves when you drink enough water.',
      category: 'mood',
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    },
    {
      id: 'sample-3',
      title: 'Exercise Frequency',
      description: 'You exercise more consistently on weekdays than weekends.',
      category: 'exercise',
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    },
    {
      id: 'sample-4',
      title: 'Nutrition Insight',
      description: 'Your energy levels are higher when you eat breakfast before 9 AM.',
      category: 'nutrition',
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    },
    {
      id: 'sample-5',
      title: 'Hydration Habit',
      description: 'You tend to drink less water on busy workdays. Try setting reminders.',
      category: 'hydration',
      date: formatDate(new Date(), 'MMM dd, yyyy'),
    },
  ];
};

export default {
  getAllInsights,
  generateNewInsight,
  generateDailyInsight
};
