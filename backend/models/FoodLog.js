const mongoose = require('mongoose');

const FoodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
  },
  calories: {
    type: Number,
  },
  protein: {
    type: Number,
  },
  carbs: {
    type: Number,
  },
  fat: {
    type: Number,
  },
  fiber: {
    type: Number,
  },
  sugar: {
    type: Number,
  },
  sodium: {
    type: Number,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  time: {
    type: String,
  },
  notes: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  barcodeData: {
    type: String,
  },
  nutritionApiData: {
    type: Object,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FoodLog', FoodLogSchema);