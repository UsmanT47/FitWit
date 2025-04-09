import axios from 'axios';

// Nutritionix API configuration
const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com/v2';
const APP_ID = process.env.NUTRITIONIX_APP_ID || '';
const APP_KEY = process.env.NUTRITIONIX_APP_KEY || '';

// Headers for Nutritionix API
const API_HEADERS = {
  'x-app-id': APP_ID,
  'x-app-key': APP_KEY,
  'Content-Type': 'application/json'
};

// Search for food items
export const searchFoodItems = async (query) => {
  if (!query || query.trim() === '') {
    return { items: [] };
  }
  
  try {
    const response = await axios.get(`${NUTRITIONIX_API_URL}/search/instant`, {
      params: { query },
      headers: API_HEADERS
    });
    
    return {
      items: response.data.branded || []
    };
  } catch (error) {
    console.error('Error searching food items:', error);
    throw handleApiError(error);
  }
};

// Get nutritional information for food by natural language query
export const getNutrientsByNaturalLanguage = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Query is required');
  }
  
  try {
    const response = await axios.post(
      `${NUTRITIONIX_API_URL}/natural/nutrients`,
      { query },
      { headers: API_HEADERS }
    );
    
    return response.data.foods || [];
  } catch (error) {
    console.error('Error getting nutrients:', error);
    throw handleApiError(error);
  }
};

// Get nutritional information for a specific food item
export const getFoodNutrients = async (foodId) => {
  if (!foodId) {
    throw new Error('Food ID is required');
  }
  
  try {
    const response = await axios.get(`${NUTRITIONIX_API_URL}/item`, {
      params: { id: foodId },
      headers: API_HEADERS
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting food nutrients:', error);
    throw handleApiError(error);
  }
};

// Mock API for development without API keys
export const mockNutritionApi = {
  async searchFoodItems(query) {
    // Simulated response
    return {
      items: [
        { 
          food_name: 'Apple', 
          nix_item_id: 'apple1', 
          brand_name: 'Generic',
          serving_qty: 1,
          serving_unit: 'medium',
          nf_calories: 95
        },
        { 
          food_name: 'Banana', 
          nix_item_id: 'banana1', 
          brand_name: 'Generic',
          serving_qty: 1,
          serving_unit: 'medium',
          nf_calories: 105
        },
        { 
          food_name: 'Chicken Breast', 
          nix_item_id: 'chicken1', 
          brand_name: 'Generic',
          serving_qty: 3,
          serving_unit: 'oz',
          nf_calories: 140
        }
      ].filter(item => 
        item.food_name.toLowerCase().includes(query.toLowerCase())
      )
    };
  },
  
  async getNutrientsByNaturalLanguage(query) {
    // Simulated response
    const foodItems = {
      'apple': { 
        food_name: 'apple', 
        nf_calories: 95, 
        nf_protein: 0.5, 
        nf_total_carbohydrate: 25, 
        nf_total_fat: 0.3 
      },
      'banana': { 
        food_name: 'banana', 
        nf_calories: 105, 
        nf_protein: 1.3, 
        nf_total_carbohydrate: 27, 
        nf_total_fat: 0.4 
      },
      'chicken': { 
        food_name: 'chicken breast', 
        nf_calories: 165, 
        nf_protein: 31, 
        nf_total_carbohydrate: 0, 
        nf_total_fat: 3.6 
      }
    };
    
    // Simple parsing of the query
    const words = query.toLowerCase().split(' ');
    const results = [];
    
    for (const word of words) {
      for (const [key, value] of Object.entries(foodItems)) {
        if (word.includes(key)) {
          results.push(value);
          break;
        }
      }
    }
    
    return results.length > 0 ? results : [{
      food_name: query,
      nf_calories: 100,
      nf_protein: 2,
      nf_total_carbohydrate: 15,
      nf_total_fat: 2
    }];
  },
  
  async getFoodNutrients(foodId) {
    // Simulated response
    return {
      food_name: 'Sample Food',
      nf_calories: 150,
      nf_protein: 5,
      nf_total_carbohydrate: 20,
      nf_total_fat: 6,
      nf_dietary_fiber: 3,
      nf_sugars: 10,
      nf_sodium: 120,
      serving_weight_grams: 100,
      serving_unit: 'g',
      serving_qty: 1
    };
  }
};

// Helper to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Nutrition API error occurred',
      error: error.response.data
    };
  }
  
  return {
    status: 500,
    message: error.message || 'Network error occurred',
    error: error
  };
};
