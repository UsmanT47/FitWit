const mongoose = require('mongoose');

const ExerciseLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
  },
  duration: {
    type: Number, // in minutes
  },
  distance: {
    type: Number,
  },
  caloriesBurned: {
    type: Number,
  },
  heartRate: {
    type: Number, // average heart rate
  },
  steps: {
    type: Number,
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
  source: {
    type: String, // e.g., 'manual', 'apple_health', 'google_fit', etc.
  },
  externalData: {
    type: Object, // store additional data from external sources
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ExerciseLog', ExerciseLogSchema);