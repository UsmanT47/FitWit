import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES, SCREEN_WIDTH } from '../../constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { FEATURES } from '../../constants/config';

const LogHomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Navigate to a specific log screen
  const navigateToLog = (screen) => {
    navigation.navigate(screen);
  };
  
  // Log card component
  const LogCard = ({ title, icon, description, screen, color, disabled = false }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: disabled ? theme.background.tertiary : theme.background.secondary,
          opacity: disabled ? 0.7 : 1,
        }
      ]}
      onPress={() => navigateToLog(screen)}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.text.primary }]}>
          {title}
        </Text>
        <Text style={[styles.cardDescription, { color: theme.text.secondary }]}>
          {description}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={disabled ? theme.text.tertiary : theme.text.secondary} 
      />
    </TouchableOpacity>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.header, { color: theme.text.primary }]}>
        Log Your Health Data
      </Text>
      <Text style={[styles.subheader, { color: theme.text.secondary }]}>
        Choose what you want to track today
      </Text>
      
      {/* Regular Logging Options */}
      <View style={styles.section}>
        <LogCard 
          title="Food & Nutrition" 
          icon="restaurant-outline" 
          description="Log meals, snacks and track calories"
          screen="FoodLog"
          color={theme.success.main}
        />
        
        <LogCard 
          title="Exercise & Activity" 
          icon="fitness-outline" 
          description="Record workouts and physical activities"
          screen="ExerciseLog"
          color={theme.secondary.main}
        />
        
        <LogCard 
          title="Sleep" 
          icon="bed-outline" 
          description="Track sleep duration and quality"
          screen="SleepLog"
          color={theme.info.main}
        />
        
        <LogCard 
          title="Mood" 
          icon="happy-outline" 
          description="Record your emotional wellbeing"
          screen="MoodLog"
          color={theme.warning.main}
        />
        
        <LogCard 
          title="Water Intake" 
          icon="water-outline" 
          description="Track your hydration"
          screen="WaterLog"
          color={theme.info.light}
        />
        
        <LogCard 
          title="Health Metrics" 
          icon="pulse-outline" 
          description="Record weight, blood pressure, etc."
          screen="HealthLog"
          color={theme.error.main}
        />
      </View>
      
      {/* Advanced Input Options */}
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Advanced Input Methods
      </Text>
      
      <View style={styles.advancedSection}>
        {/* Barcode Scanner */}
        <TouchableOpacity 
          style={[
            styles.advancedCard, 
            { 
              backgroundColor: FEATURES.BARCODE_SCANNING 
                ? theme.background.accent 
                : theme.background.tertiary,
              opacity: FEATURES.BARCODE_SCANNING ? 1 : 0.7,
            }
          ]}
          onPress={() => navigateToLog('ScanBarcode')}
          disabled={!FEATURES.BARCODE_SCANNING}
        >
          <View style={styles.advancedCardContent}>
            <Ionicons 
              name="barcode-outline" 
              size={32} 
              color={FEATURES.BARCODE_SCANNING ? theme.primary.main : theme.text.tertiary} 
            />
            <View style={styles.advancedTextContainer}>
              <Text style={[styles.advancedTitle, { color: theme.text.primary }]}>
                Scan Food Barcode
              </Text>
              <Text style={[styles.advancedDescription, { color: theme.text.secondary }]}>
                Quickly log food by scanning package barcodes
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={FEATURES.BARCODE_SCANNING ? theme.text.secondary : theme.text.tertiary} 
          />
        </TouchableOpacity>
        
        {/* Voice Input */}
        <TouchableOpacity 
          style={[
            styles.advancedCard, 
            { 
              backgroundColor: FEATURES.VOICE_INPUT 
                ? theme.background.accent 
                : theme.background.tertiary,
              opacity: FEATURES.VOICE_INPUT ? 1 : 0.7,
            }
          ]}
          onPress={() => navigateToLog('VoiceInput')}
          disabled={!FEATURES.VOICE_INPUT}
        >
          <View style={styles.advancedCardContent}>
            <Ionicons 
              name="mic-outline" 
              size={32} 
              color={FEATURES.VOICE_INPUT ? theme.primary.main : theme.text.tertiary} 
            />
            <View style={styles.advancedTextContainer}>
              <Text style={[styles.advancedTitle, { color: theme.text.primary }]}>
                Voice Input
              </Text>
              <Text style={[styles.advancedDescription, { color: theme.text.secondary }]}>
                Describe your meals, workouts, or sleep with voice
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={FEATURES.VOICE_INPUT ? theme.text.secondary : theme.text.tertiary} 
          />
        </TouchableOpacity>
        
        {/* Import from Wearable */}
        <TouchableOpacity 
          style={[
            styles.advancedCard, 
            { 
              backgroundColor: FEATURES.WEARABLE_SYNC 
                ? theme.background.accent 
                : theme.background.tertiary,
              opacity: FEATURES.WEARABLE_SYNC ? 1 : 0.7,
            }
          ]}
          disabled={!FEATURES.WEARABLE_SYNC}
        >
          <View style={styles.advancedCardContent}>
            <Ionicons 
              name="watch-outline" 
              size={32} 
              color={FEATURES.WEARABLE_SYNC ? theme.primary.main : theme.text.tertiary} 
            />
            <View style={styles.advancedTextContainer}>
              <Text style={[styles.advancedTitle, { color: theme.text.primary }]}>
                Import from Wearable
              </Text>
              <Text style={[styles.advancedDescription, { color: theme.text.secondary }]}>
                Sync data from your fitness tracker (Coming Soon)
              </Text>
              {!FEATURES.WEARABLE_SYNC && (
                <View style={[styles.comingSoonBadge, { backgroundColor: theme.primary.light }]}>
                  <Text style={[styles.comingSoonText, { color: theme.primary.contrast }]}>
                    Coming Soon
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={FEATURES.WEARABLE_SYNC ? theme.text.secondary : theme.text.tertiary} 
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.LARGE,
    paddingBottom: SPACING.XXLARGE,
  },
  header: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    marginBottom: SPACING.TINY,
  },
  subheader: {
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  section: {
    marginBottom: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: FONT_SIZES.SMALL,
  },
  advancedSection: {
    marginBottom: SPACING.LARGE,
  },
  advancedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  advancedCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  advancedTextContainer: {
    flex: 1,
    marginLeft: SPACING.MEDIUM,
  },
  advancedTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  advancedDescription: {
    fontSize: FONT_SIZES.SMALL,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: SPACING.SMALL,
    marginTop: SPACING.TINY,
  },
  comingSoonText: {
    fontSize: FONT_SIZES.TINY,
    fontWeight: 'bold',
  },
});

export default LogHomeScreen;