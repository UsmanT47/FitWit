const mongoose = require('mongoose');

const SleepLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
  },
  quality: {
    type: Number,
    min: 1,
    max: 10,
  },
  deepSleep: {
    type: Number, // in minutes
  },
  lightSleep: {
    type: Number, // in minutes
  },
  remSleep: {
    type: Number, // in minutes
  },
  awakeDuration: {
    type: Number, // in minutes
  },
  date: {
    type: Date,
    required: true,
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

// Calculate sleep duration before saving
SleepLogSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    // Calculate duration in minutes
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  next();
});

module.exports = mongoose.model('SleepLog', SleepLogSchema);