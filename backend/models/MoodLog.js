const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'calm', 'sad', 'stressed', 'angry', 'neutral'],
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
  },
  factors: {
    type: [String],
    default: [],
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('MoodLog', MoodLogSchema);