import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import AppHeader from '../../components/AppHeader';
import DatePicker from '../../components/DatePicker';
import FoodItem from '../../components/FoodItem';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { logFood, getFoodHistory } from '../../services/storageService';
import { mockNutritionApi } from '../../api/nutritionApi';
import { formatDate } from '../../utils/dateUtils';

// Meal types
const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack'
];

const FoodLogScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  
  // Form state
  const [mealType, setMealType] = useState('Breakfast');
  const [date, setDate] = useState(new Date());
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  
  // History state
  const [foodHistory, setFoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('log'); // 'log', 'search', 'history'
  
  // Load food history on mount
  useEffect(() => {
    loadFoodHistory();
  }, []);
  
  // Load food history
  const loadFoodHistory = async () => {
    try {
      const history = await getFoodHistory();
      setFoodHistory(history);
    } catch (error) {
      console.error('Error loading food history:', error);
    }
  };
  
  // Handle food search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await mockNutritionApi.searchFoodItems(searchQuery);
      setSearchResults(response.items || []);
      setViewMode('search');
    } catch (error) {
      console.error('Error searching food:', error);
      Alert.alert('Search Error', 'Failed to search for food items. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle selecting a food item
  const handleFoodSelect = async (food) => {
    setSelectedFood(food);
    setViewMode('log');
  };
  
  // Handle submitting the food log
  const handleSubmit = async () => {
    if (!selectedFood) {
      Alert.alert('Missing Food', 'Please search and select a food item');
      return;
    }
    
    if (!mealType) {
      Alert.alert('Missing Information', 'Please select a meal type');
      return;
    }
    
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const foodData = {
        food_name: selectedFood.food_name,
        brand_name: selectedFood.brand_name || 'Generic',
        serving_qty: parsedQuantity,
        serving_unit: selectedFood.serving_unit || 'serving',
        calories: Math.round(selectedFood.nf_calories * parsedQuantity),
        protein: selectedFood.nf_protein ? Math.round(selectedFood.nf_protein * parsedQuantity) : null,
        carbs: selectedFood.nf_total_carbohydrate ? Math.round(selectedFood.nf_total_carbohydrate * parsedQuantity) : null,
        fat: selectedFood.nf_total_fat ? Math.round(selectedFood.nf_total_fat * parsedQuantity) : null,
        meal_type: mealType,
        date: formatDate(date, 'yyyy-MM-dd'),
        time: formatDate(date, 'HH:mm'),
        notes,
      };
      
      await logFood(foodData);
      
      // Refresh history
      await loadFoodHistory();
      
      // Reset form
      setSelectedFood(null);
      setSearchQuery('');
      setSearchResults([]);
      setQuantity('1');
      setNotes('');
      
      // Show confirmation
      Alert.alert('Success', 'Food logged successfully!');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to log food. Please try again.');
      console.error('Error logging food:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render meal type button
  const renderMealTypeButton = (type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.mealTypeButton,
        mealType === type && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary
        },
        mealType !== type && { 
          backgroundColor: 'transparent',
          borderColor: theme.border
        }
      ]}
      onPress={() => setMealType(type)}
      accessibilityLabel={`Select ${type} meal type`}
      accessibilityRole="button"
      accessibilityState={{ selected: mealType === type }}
    >
      <Text 
        style={[
          styles.mealTypeText,
          { color: mealType === type ? '#fff' : theme.text }
        ]}
      >
        {type}
      </Text>
    </TouchableOpacity>
  );
  
  // Render search results
  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      <View style={styles.searchResultsHeader}>
        <Text style={[styles.searchResultsTitle, { color: theme.text }]}>
          Search Results
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setViewMode('log')}
          accessibilityLabel="Back to food log"
          accessibilityRole="button"
        >
          <Feather name="x" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Searching...
          </Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `food-${index}`}
          renderItem={({ item }) => (
            <FoodItem
              item={item}
              onPress={() => handleFoodSelect(item)}
            />
          )}
          contentContainerStyle={styles.foodList}
        />
      ) : (
        <EmptyState
          icon="search"
          title="No Results Found"
          message="Try another search term or be more specific."
        />
      )}
    </View>
  );
  
  // Render food history
  const renderFoodHistory = () => (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: theme.text }]}>
          Food History
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setViewMode('log')}
          accessibilityLabel="Back to food log"
          accessibilityRole="button"
        >
          <Feather name="x" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {foodHistory.length > 0 ? (
        <FlatList
          data={foodHistory}
          keyExtractor={(item, index) => `history-${index}`}
          renderItem={({ item }) => (
            <FoodItem
              item={item}
              showDetails
            />
          )}
          contentContainerStyle={styles.foodList}
        />
      ) : (
        <EmptyState
          icon="book"
          title="No Food History"
          message="Your logged meals will appear here."
        />
      )}
    </View>
  );
  
  // Render food log form
  const renderFoodLogForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { 
                backgroundColor: theme.input,
                borderColor: theme.inputBorder,
                color: theme.text
              }
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for food..."
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            accessibilityLabel="Search for food"
          />
          
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.primary }]}
            onPress={handleSearch}
            disabled={isSearching}
            accessibilityLabel="Search button"
            accessibilityHint="Search for food items"
          >
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {selectedFood ? (
          <View 
            style={[
              styles.selectedFoodContainer,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
          >
            <Text style={[styles.selectedFoodTitle, { color: theme.text }]}>
              Selected Food
            </Text>
            <FoodItem item={selectedFood} showDetails />
            <TouchableOpacity
              style={styles.clearSelectionButton}
              onPress={() => setSelectedFood(null)}
              accessibilityLabel="Clear selection"
              accessibilityRole="button"
            >
              <Text style={[styles.clearSelectionText, { color: theme.danger }]}>
                Clear Selection
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View 
            style={[
              styles.noFoodSelectedContainer,
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }
            ]}
          >
            <Feather name="coffee" size={32} color={theme.textSecondary} />
            <Text style={[styles.noFoodSelectedText, { color: theme.text }]}>
              Search for a food item to log
            </Text>
          </View>
        )}
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Meal Details
        </Text>
        
        <Text style={[styles.label, { color: theme.text }]}>
          Meal Type
        </Text>
        <View style={styles.mealTypesContainer}>
          {MEAL_TYPES.map(type => renderMealTypeButton(type))}
        </View>
        
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={[styles.label, { color: theme.text }]}>
              Quantity
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.input,
                  borderColor: theme.inputBorder,
                  color: theme.text
                }
              ]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Food quantity"
            />
          </View>
          
          <View style={styles.halfWidth}>
            <DatePicker
              label="Date & Time"
              date={date}
              onChange={setDate}
              mode="datetime"
              format="MMM dd, yyyy h:mm a"
            />
          </View>
        </View>
        
        <Text style={[styles.label, { color: theme.text }]}>
          Notes (optional)
        </Text>
        <TextInput
          style={[
            styles.textArea,
            { 
              backgroundColor: theme.input,
              borderColor: theme.inputBorder,
              color: theme.text
            }
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about this meal..."
          placeholderTextColor={theme.textSecondary}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          accessibilityLabel="Food notes"
        />
        
        <CustomButton
          title="Log Food"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !selectedFood}
          style={styles.submitButton}
          accessibilityLabel="Submit food log"
        />
        
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setViewMode('history')}
          accessibilityLabel="View food history"
          accessibilityRole="button"
        >
          <Text style={[styles.historyButtonText, { color: theme.primary }]}>
            View Food History
          </Text>
          <Feather name="chevron-right" size={18} color={theme.primary} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader 
        title="Log Food" 
        showBackButton={true}
      />
      
      {viewMode === 'search' && renderSearchResults()}
      {viewMode === 'history' && renderFoodHistory()}
      {viewMode === 'log' && renderFoodLogForm()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFoodContainer: {
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  selectedFoodTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  clearSelectionButton: {
    alignSelf: 'flex-end',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  clearSelectionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  noFoodSelectedContainer: {
    padding: SPACING.lg,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFoodSelectedText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  mealTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  mealTypeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  mealTypeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.sm,
    height: 100,
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginBottom: SPACING.lg,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  historyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
  searchResultsContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  searchResultsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  backButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  foodList: {
    paddingBottom: SPACING.xl,
  },
  historyContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  historyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});

export default FoodLogScreen;
