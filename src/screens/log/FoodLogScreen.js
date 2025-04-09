import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES } from '../../constants/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { searchFoodItems, mockNutritionApi } from '../../api/nutritionApi';
import { logFood } from '../../services/storageService';
import { formatDate } from '../../utils/dateUtils';

// We'll use a local implementation for this demo
const nutritionApi = mockNutritionApi;

const FoodLogScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState('Breakfast');
  const [isSaving, setIsSaving] = useState(false);
  
  // Meal type options
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  // Search food items
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await nutritionApi.searchFoodItems(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching food:', error);
      Alert.alert('Error', 'Failed to search for food items');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Select a food item
  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setSearchResults([]);
  };
  
  // Save food log
  const handleSaveFood = async () => {
    if (!selectedFood) {
      Alert.alert('Error', 'Please select a food item');
      return;
    }
    
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Create food log entry
      const foodEntry = {
        food: selectedFood.name,
        calories: selectedFood.calories * parsedQuantity,
        quantity: parsedQuantity,
        servingSize: selectedFood.servingSize,
        mealType,
        nutrients: {
          protein: selectedFood.nutrients.protein * parsedQuantity,
          carbs: selectedFood.nutrients.carbs * parsedQuantity,
          fat: selectedFood.nutrients.fat * parsedQuantity,
          fiber: selectedFood.nutrients.fiber * parsedQuantity,
        },
        date: formatDate(new Date()),
      };
      
      // Save to storage
      await logFood(foodEntry);
      
      // Show success message
      Alert.alert(
        'Success',
        'Food logged successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving food log:', error);
      Alert.alert('Error', 'Failed to save food log');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Navigate to barcode scanning
  const navigateToBarcodeScan = () => {
    navigation.navigate('ScanBarcode');
  };
  
  // Navigate to voice input
  const navigateToVoiceInput = () => {
    navigation.navigate('VoiceInput');
  };
  
  // Render a food search result item
  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.foodItem, { backgroundColor: theme.background.secondary }]}
      onPress={() => handleSelectFood(item)}
    >
      <View style={styles.foodItemContent}>
        <Text style={[styles.foodItemName, { color: theme.text.primary }]}>
          {item.name}
        </Text>
        <Text style={[styles.foodItemDetails, { color: theme.text.secondary }]}>
          {item.calories} cal | {item.servingSize}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
    </TouchableOpacity>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Find Food
        </Text>
        <View style={styles.searchInputContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.background.secondary }]}>
            <TextInput
              style={[styles.searchInput, { color: theme.text.primary }]}
              placeholder="Search for a food item..."
              placeholderTextColor={theme.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {isSearching ? (
              <ActivityIndicator size="small" color={theme.primary.main} />
            ) : (
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={24} color={theme.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Alternative Input Methods */}
        <View style={styles.alternativeInputs}>
          <TouchableOpacity 
            style={[styles.alternativeButton, { backgroundColor: theme.background.secondary }]}
            onPress={navigateToBarcodeScan}
          >
            <Ionicons name="barcode-outline" size={18} color={theme.primary.main} />
            <Text style={[styles.alternativeButtonText, { color: theme.text.primary }]}>
              Scan Barcode
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.alternativeButton, { backgroundColor: theme.background.secondary }]}
            onPress={navigateToVoiceInput}
          >
            <Ionicons name="mic-outline" size={18} color={theme.primary.main} />
            <Text style={[styles.alternativeButtonText, { color: theme.text.primary }]}>
              Voice Input
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Search Results
          </Text>
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
      
      {/* Selected Food Section */}
      {selectedFood && (
        <View style={styles.selectedFoodSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Log Food
          </Text>
          
          <View style={[styles.selectedFoodCard, { backgroundColor: theme.background.secondary }]}>
            <Text style={[styles.selectedFoodName, { color: theme.text.primary }]}>
              {selectedFood.name}
            </Text>
            
            <View style={styles.nutrientsContainer}>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: theme.primary.main }]}>
                  {selectedFood.calories}
                </Text>
                <Text style={[styles.nutrientLabel, { color: theme.text.secondary }]}>
                  Calories
                </Text>
              </View>
              
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: theme.success.main }]}>
                  {selectedFood.nutrients.protein}g
                </Text>
                <Text style={[styles.nutrientLabel, { color: theme.text.secondary }]}>
                  Protein
                </Text>
              </View>
              
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: theme.warning.main }]}>
                  {selectedFood.nutrients.carbs}g
                </Text>
                <Text style={[styles.nutrientLabel, { color: theme.text.secondary }]}>
                  Carbs
                </Text>
              </View>
              
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: theme.error.main }]}>
                  {selectedFood.nutrients.fat}g
                </Text>
                <Text style={[styles.nutrientLabel, { color: theme.text.secondary }]}>
                  Fat
                </Text>
              </View>
            </View>
            
            <Text style={[styles.servingSize, { color: theme.text.secondary }]}>
              Serving size: {selectedFood.servingSize}
            </Text>
          </View>
          
          {/* Quantity Input */}
          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: theme.text.primary }]}>
              Quantity:
            </Text>
            <TextInput
              style={[
                styles.quantityInput, 
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.text.primary,
                  borderColor: theme.border
                }
              ]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={theme.text.tertiary}
            />
          </View>
          
          {/* Meal Type Selection */}
          <Text style={[styles.inputLabel, { color: theme.text.primary }]}>
            Meal:
          </Text>
          <View style={styles.mealTypeContainer}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  { 
                    backgroundColor: mealType === type 
                      ? theme.primary.main 
                      : theme.background.secondary,
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => setMealType(type)}
              >
                <Text 
                  style={[
                    styles.mealTypeText, 
                    { 
                      color: mealType === type 
                        ? theme.primary.contrast 
                        : theme.text.primary 
                    }
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary.main }]}
            onPress={handleSaveFood}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.primary.contrast} />
            ) : (
              <Text style={[styles.saveButtonText, { color: theme.primary.contrast }]}>
                Save Food Log
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE,
  },
  searchSection: {
    marginBottom: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  searchInputContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: FONT_SIZES.MEDIUM,
  },
  alternativeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    width: '48%',
    justifyContent: 'center',
  },
  alternativeButtonText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '500',
    marginLeft: SPACING.SMALL,
  },
  resultsSection: {
    marginBottom: SPACING.LARGE,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
  },
  foodItemContent: {
    flex: 1,
  },
  foodItemName: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '500',
    marginBottom: 2,
  },
  foodItemDetails: {
    fontSize: FONT_SIZES.SMALL,
  },
  selectedFoodSection: {
    marginBottom: SPACING.LARGE,
  },
  selectedFoodCard: {
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  selectedFoodName: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MEDIUM,
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nutrientLabel: {
    fontSize: FONT_SIZES.TINY,
  },
  servingSize: {
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.SMALL,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  inputLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '500',
    marginBottom: SPACING.SMALL,
  },
  quantityInput: {
    height: 40,
    width: 80,
    borderWidth: 1,
    borderRadius: SPACING.SMALL,
    marginLeft: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    textAlign: 'center',
    fontSize: FONT_SIZES.MEDIUM,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.LARGE,
  },
  mealTypeButton: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    marginRight: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
    borderWidth: 1,
  },
  mealTypeText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '500',
  },
  saveButton: {
    height: 50,
    borderRadius: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
});

export default FoodLogScreen;