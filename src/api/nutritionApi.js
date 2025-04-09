import { API_URL, NUTRITION_API_URL } from '../constants/config';

/**
 * Search food items by query
 * @param {String} query Search query
 * @returns {Promise<Array>} Array of food items
 */
export const searchFoodItems = async (query) => {
  try {
    const response = await fetch(`${API_URL}/nutrition/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to search food items');
    }
    
    return data;
  } catch (error) {
    console.error('Search food API error:', error);
    throw error;
  }
};

/**
 * Get food nutrients using natural language
 * @param {String} query Natural language query
 * @returns {Promise<Object>} Food nutrients data
 */
export const getNutrientsByNaturalLanguage = async (query) => {
  try {
    const response = await fetch(`${API_URL}/nutrition/natural?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get nutrients');
    }
    
    return data;
  } catch (error) {
    console.error('Natural language nutrition API error:', error);
    throw error;
  }
};

/**
 * Get food nutrients by food ID
 * @param {String} foodId Food ID
 * @returns {Promise<Object>} Food nutrients data
 */
export const getFoodNutrients = async (foodId) => {
  try {
    const response = await fetch(`${API_URL}/nutrition/food/${foodId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get food nutrients');
    }
    
    return data;
  } catch (error) {
    console.error('Food nutrients API error:', error);
    throw error;
  }
};

// Mock implementation for testing/development without backend
export const mockNutritionApi = {
  async searchFoodItems(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock response
    return [
      {
        id: '1',
        name: 'Apple',
        brand: null,
        calories: 52,
        servingSize: '100g',
        nutrients: {
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
          fiber: 2.4,
        },
      },
      {
        id: '2',
        name: 'Banana',
        brand: null,
        calories: 89,
        servingSize: '100g',
        nutrients: {
          protein: 1.1,
          carbs: 22.8,
          fat: 0.3,
          fiber: 2.6,
        },
      },
      {
        id: '3',
        name: 'Chicken Breast',
        brand: null,
        calories: 165,
        servingSize: '100g',
        nutrients: {
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
        },
      },
      {
        id: '4',
        name: 'Salmon',
        brand: null,
        calories: 208,
        servingSize: '100g',
        nutrients: {
          protein: 20,
          carbs: 0,
          fat: 13,
          fiber: 0,
        },
      },
      {
        id: '5',
        name: 'Brown Rice',
        brand: null,
        calories: 112,
        servingSize: '100g',
        nutrients: {
          protein: 2.6,
          carbs: 23,
          fat: 0.9,
          fiber: 1.8,
        },
      },
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  },
  
  async getNutrientsByNaturalLanguage(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock response based on query
    if (query.toLowerCase().includes('apple')) {
      return {
        name: 'Apple',
        calories: 52,
        servingSize: '1 medium (182g)',
        nutrients: {
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
          fiber: 2.4,
          sugar: 10.4,
          sodium: 1,
        },
      };
    } else if (query.toLowerCase().includes('chicken')) {
      return {
        name: 'Chicken Breast',
        calories: 165,
        servingSize: '100g',
        nutrients: {
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
          sugar: 0,
          sodium: 74,
        },
      };
    } else {
      return {
        name: query,
        calories: 100,
        servingSize: '100g',
        nutrients: {
          protein: 5,
          carbs: 10,
          fat: 5,
          fiber: 2,
          sugar: 2,
          sodium: 50,
        },
      };
    }
  },
  
  async getFoodNutrients(foodId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response based on foodId
    const foods = {
      '1': {
        id: '1',
        name: 'Apple',
        calories: 52,
        servingSize: '1 medium (182g)',
        nutrients: {
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
          fiber: 2.4,
          sugar: 10.4,
          sodium: 1,
          vitaminA: 54,
          vitaminC: 4.6,
          calcium: 6,
          iron: 0.1,
        },
      },
      '2': {
        id: '2',
        name: 'Banana',
        calories: 89,
        servingSize: '1 medium (118g)',
        nutrients: {
          protein: 1.1,
          carbs: 22.8,
          fat: 0.3,
          fiber: 2.6,
          sugar: 12.2,
          sodium: 1,
          vitaminA: 64,
          vitaminC: 8.7,
          calcium: 5,
          iron: 0.3,
        },
      },
    };
    
    return foods[foodId] || {
      id: foodId,
      name: 'Unknown Food',
      calories: 100,
      servingSize: '100g',
      nutrients: {
        protein: 5,
        carbs: 10,
        fat: 5,
        fiber: 2,
        sugar: 2,
        sodium: 50,
      },
    };
  },
};