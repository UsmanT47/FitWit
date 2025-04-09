/**
 * AI service for generating insights and recommendations
 */
import { getUserData } from './storageService';
import { formatDate } from '../utils/dateUtils';

/**
 * Generate AI insights from user health data
 * @returns {Array} Array of insight objects
 */
export const getAllInsights = async () => {
  try {
    // Get user data
    const userData = await getUserData();
    
    // Check if there's enough data for meaningful analysis
    if (!hasEnoughDataForAnalysis(userData)) {
      return getSampleInsights();
    }
    
    // In a real implementation, we'd send the data to an AI service
    // For now, return sample insights
    const insights = [
      // Sleep-mood correlation insight
      analyzeSleepMoodCorrelation(userData.sleep, userData.mood),
      
      // Exercise-mood correlation insight
      analyzeExerciseMoodCorrelation(userData.exercise, userData.mood),
      
      // Water intake pattern insight
      analyzeWaterIntakePatterns(userData.water),
      
      // Additional sample insights
      ...getSampleInsights().slice(0, 2),
    ].filter(Boolean); // Remove any null insights
    
    return insights.length > 0 ? insights : getSampleInsights();
  } catch (error) {
    console.error('Error generating insights:', error);
    return getSampleInsights();
  }
};

/**
 * Generate a new insight on demand
 * @returns {Object} Newly generated insight
 */
export const generateNewInsight = async () => {
  try {
    // Get user data
    const userData = await getUserData();
    
    // In a real implementation, we'd send the data to an AI service
    // For now, return a random sample insight
    const sampleInsights = getSampleInsights();
    const randomIndex = Math.floor(Math.random() * sampleInsights.length);
    const insight = sampleInsights[randomIndex];
    
    // Add a timestamp
    return {
      ...insight,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating new insight:', error);
    return getSampleInsights()[0];
  }
};

/**
 * Generate an insight for the daily dashboard
 * @returns {Array} Array of insight objects for the dashboard
 */
export const generateDailyInsight = async () => {
  try {
    // Get user data
    const userData = await getUserData();
    
    // Check if there's enough data
    if (!hasEnoughDataForAnalysis(userData)) {
      return [getSampleInsights()[0]];
    }
    
    // In a real implementation, we'd use the OpenAI API to generate personalized insights
    // For now, return a sample insight for the dashboard
    const dailyInsights = [
      {
        id: 'daily-1',
        title: 'Daily Wellness Tip',
        content: 'Based on your recent activity patterns, try to incorporate a 10-minute stretching session in the morning to improve flexibility and reduce muscle tension.',
        type: 'general',
        createdAt: new Date().toISOString(),
      }
    ];
    
    return dailyInsights;
  } catch (error) {
    console.error('Error generating daily insight:', error);
    return [getSampleInsights()[0]];
  }
};

/**
 * Check if there's enough data for meaningful analysis
 * @param {Object} data Historical user data
 * @returns {Boolean} True if enough data exists
 */
const hasEnoughDataForAnalysis = (data) => {
  // Check if there are enough data points for analysis
  const totalEntries = 
    data.food.length +
    data.water.length + 
    data.exercise.length +
    data.sleep.length +
    data.mood.length;
  
  // Require at least 5 entries for meaningful analysis
  return totalEntries >= 5;
};

/**
 * Analyze correlation between sleep and mood
 * @param {Array} sleepData Array of sleep records
 * @param {Array} moodData Array of mood records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeSleepMoodCorrelation = (sleepData, moodData) => {
  // Mock implementation - in a real app, this would perform actual analysis
  if (sleepData.length < 3 || moodData.length < 3) {
    return null;
  }
  
  return {
    id: 'sleep-mood-1',
    title: 'Sleep Quality Affects Your Mood',
    content: 'We\'ve noticed that on days when you sleep more than 7 hours, you tend to report a more positive mood the following day. Maintaining consistent sleep patterns could help improve your overall well-being.',
    type: 'sleep',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Analyze correlation between exercise and mood
 * @param {Array} exerciseData Array of exercise records
 * @param {Array} moodData Array of mood records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeExerciseMoodCorrelation = (exerciseData, moodData) => {
  // Mock implementation - in a real app, this would perform actual analysis
  if (exerciseData.length < 3 || moodData.length < 3) {
    return null;
  }
  
  return {
    id: 'exercise-mood-1',
    title: 'Exercise Boosts Your Mood',
    content: 'Your mood logs show improvement on days when you exercise. Even short 15-minute sessions appear to have a positive impact on your emotional well-being. Consider adding brief workouts on busy days.',
    type: 'exercise',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Analyze water intake patterns
 * @param {Array} waterData Array of water intake records
 * @returns {Object|null} Insight object or null if no pattern found
 */
const analyzeWaterIntakePatterns = (waterData) => {
  // Mock implementation - in a real app, this would perform actual analysis
  if (waterData.length < 3) {
    return null;
  }
  
  return {
    id: 'hydration-1',
    title: 'Morning Hydration Matters',
    content: "Your data suggests that you are consuming most of your daily water in the afternoon. Try starting your day with a glass of water to help jumpstart your metabolism and improve energy levels throughout the day.",
    type: 'hydration',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generate a sample insight for testing/placeholder
 * @returns {Object} Sample insight
 */
const generateSampleInsight = () => {
  const insightTypes = ['general', 'nutrition', 'exercise', 'sleep', 'mood', 'hydration'];
  const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
  
  // Generate a random ID
  const id = `sample-${Date.now()}`;
  
  // Insights by type
  const insights = {
    general: {
      title: 'Establish a Morning Routine',
      content: 'Creating a consistent morning routine can set a positive tone for your day. Consider incorporating meditation, hydration, and light stretching to start your day mindfully.',
    },
    nutrition: {
      title: 'Protein and Energy Levels',
      content: 'Based on your food logs, you may benefit from including more protein in your breakfast. This could help maintain steady energy levels throughout the morning.',
    },
    exercise: {
      title: 'Find Your Optimal Exercise Time',
      content: 'Your workout logs show better consistency when you exercise in the evening. Consider scheduling your workouts when you naturally have more energy for better adherence.',
    },
    sleep: {
      title: 'Create a Sleep Wind-Down Routine',
      content: 'Your sleep data suggests irregular bedtimes. Creating a 30-minute wind-down routine before bed could help improve your sleep quality and make it easier to fall asleep.',
    },
    mood: {
      title: 'Social Interaction and Mood',
      content: 'Days when you engage in social activities correlate with more positive mood entries. Consider incorporating regular social connections into your weekly routine.',
    },
    hydration: {
      title: 'Hydration and Energy',
      content: 'Meeting your water intake goals appears to correlate with higher reported energy levels. Try keeping a water bottle visible as a reminder to stay hydrated throughout the day.',
    },
  };
  
  return {
    id,
    title: insights[randomType].title,
    content: insights[randomType].content,
    type: randomType,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get a set of sample insights
 * @returns {Array} Array of sample insights
 */
const getSampleInsights = () => {
  return [
    {
      id: 'sample-1',
      title: 'Balance Your Nutrition',
      content: 'Your food logs show a good intake of protein, but you might benefit from adding more variety of vegetables to get a wider range of nutrients. Aim for 5 different colored vegetables daily.',
      type: 'nutrition',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
    {
      id: 'sample-2',
      title: 'Optimize Your Sleep Schedule',
      content: 'Your sleep data suggests that you get the most restful sleep when you go to bed before 11 PM. Try maintaining a consistent bedtime to improve your sleep quality and morning energy levels.',
      type: 'sleep',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    },
    {
      id: 'sample-3',
      title: 'Exercise Recovery Pattern',
      content: 'We noticed that you tend to skip exercise after high-intensity workout days. Consider adding light recovery activities like yoga or walking on the day after intense workouts instead of taking a complete rest day.',
      type: 'exercise',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    },
    {
      id: 'sample-4',
      title: 'Midday Energy Dip',
      content: 'Your mood and energy logs show a consistent dip in the mid-afternoon. Try having a small protein-rich snack and a short walk around 2-3 PM to maintain your energy levels throughout the day.',
      type: 'mood',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    },
    {
      id: 'sample-5',
      title: 'Hydration and Headaches',
      content: 'There appears to be a correlation between days when you drink less water and reported headaches in your health logs. Try to maintain consistent water intake throughout the day, especially during busy periods.',
      type: 'hydration',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    },
  ];
};