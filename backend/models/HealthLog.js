const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  bmi: {
    type: Number, 
  },
  bloodPressureSystolic: {
    type: Number,
  },
  bloodPressureDiastolic: {
    type: Number,
  },
  heartRate: {
    type: Number,
  },
  bloodGlucose: {
    type: Number,
  },
  bodyTemperature: {
    type: Number,
  },
  bodyFatPercentage: {
    type: Number, 
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

// Calculate BMI before saving if weight and height are available
HealthLogSchema.pre('save', function(next) {
  if (this.weight && this.height && this.height > 0) {
    // Calculate BMI: weight(kg) / (height(m) * height(m))
    // Assuming weight is in kg and height is in cm
    const heightInMeters = this.height / 100;
    this.bmi = this.weight / (heightInMeters * heightInMeters);
    // Round to 1 decimal place
    this.bmi = Math.round(this.bmi * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);