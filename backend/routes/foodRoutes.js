const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/food
 * @desc    Create a new food log entry
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const newFoodLog = new FoodLog({
      user: req.user.id,
      name: req.body.name,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      fiber: req.body.fiber,
      sugar: req.body.sugar,
      sodium: req.body.sodium,
      mealType: req.body.mealType,
      date: req.body.date || new Date(),
      time: req.body.time,
      notes: req.body.notes,
      imageUrl: req.body.imageUrl,
      barcodeData: req.body.barcodeData,
      nutritionApiData: req.body.nutritionApiData,
    });
    
    const foodLog = await newFoodLog.save();
    
    res.status(201).json(foodLog);
  } catch (error) {
    console.error('Food log create error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/food
 * @desc    Get all food logs for current user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    // Get query parameters
    const { startDate, endDate } = req.query;
    
    // Build filter
    const filter = { user: req.user.id };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const foodLogs = await FoodLog.find(filter).sort({ date: -1 });
    
    res.json(foodLogs);
  } catch (error) {
    console.error('Food logs get error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/food/:id
 * @desc    Get a food log by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const foodLog = await FoodLog.findById(req.params.id);
    
    if (!foodLog) {
      return res.status(404).json({ message: 'Food log not found' });
    }
    
    // Check if log belongs to current user
    if (foodLog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(foodLog);
  } catch (error) {
    console.error('Food log get error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/food/:id
 * @desc    Update a food log
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    let foodLog = await FoodLog.findById(req.params.id);
    
    if (!foodLog) {
      return res.status(404).json({ message: 'Food log not found' });
    }
    
    // Check if log belongs to current user
    if (foodLog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields (excluding user ID)
    const updateData = { ...req.body };
    delete updateData.user; // Prevent user ID change
    
    foodLog = await FoodLog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(foodLog);
  } catch (error) {
    console.error('Food log update error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/food/:id
 * @desc    Delete a food log
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const foodLog = await FoodLog.findById(req.params.id);
    
    if (!foodLog) {
      return res.status(404).json({ message: 'Food log not found' });
    }
    
    // Check if log belongs to current user
    if (foodLog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await foodLog.remove();
    
    res.json({ message: 'Food log removed' });
  } catch (error) {
    console.error('Food log delete error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;