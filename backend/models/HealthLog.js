const mongoose = require('mongoose');

// Base schema for common fields
const baseLogFields = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  }
};

// Food log schema
const FoodLogSchema = new mongoose.Schema({
  ...baseLogFields,
  food_name: {
    type: String,
    required: true,
    trim: true,
  },
  brand_name: {
    type: String,
    trim: true,
  },
  meal_type: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true,
  },
  serving_qty: {
    type: Number,
    required: true,
  },
  serving_unit: {
    type: String,
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
  time: {
    type: String,
  }
});

// Mood log schema
const MoodLogSchema = new mongoose.Schema({
  ...baseLogFields,
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  label: {
    type: String,
    required: true,
    enum: ['Terrible', 'Bad', 'Neutral', 'Good', 'Great'],
  },
  factors: {
    type: [String],
    default: [],
  },
  time: {
    type: String,
  }
});

// Exercise log schema
const ExerciseLogSchema = new mongoose.Schema({
  ...baseLogFields,
  type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'vigorous'],
    default: 'moderate',
  },
  calories: {
    type: Number,
  },
  isOutdoor: {
    type: Boolean,
    default: false,
  },
  time: {
    type: String,
  }
});

// Sleep log schema
const SleepLogSchema = new mongoose.Schema({
  ...baseLogFields,
  bedtime: {
    type: String,
    required: true,
  },
  wakeTime: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    required: true,
  },
  disruptors: {
    type: [String],
    default: [],
  },
  deepSleep: {
    type: Boolean,
    default: false,
  }
});

// Water log schema
const WaterLogSchema = new mongoose.Schema({
  ...baseLogFields,
  glasses: {
    type: Number,
    required: true,
    min: 0,
  },
  goal: {
    type: Number,
    default: 8,
  },
  time: {
    type: String,
  }
});

// Reminder schema
const ReminderSchema = new mongoose.Schema({
  ...baseLogFields,
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['food', 'water', 'mood', 'exercise', 'sleep', 'custom'],
  },
  time: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  frequency: {
    type: mongoose.Schema.Types.Mixed,
    default: 'daily',
  },
  description: {
    type: String,
  },
  notificationId: {
    type: String,
  }
});

// Create models from schemas
const FoodLog = mongoose.model('FoodLog', FoodLogSchema);
const MoodLog = mongoose.model('MoodLog', MoodLogSchema);
const ExerciseLog = mongoose.model('ExerciseLog', ExerciseLogSchema);
const SleepLog = mongoose.model('SleepLog', SleepLogSchema);
const WaterLog = mongoose.model('WaterLog', WaterLogSchema);
const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = {
  FoodLog,
  MoodLog,
  ExerciseLog,
  SleepLog,
  WaterLog,
  Reminder
};
