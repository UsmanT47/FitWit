const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['water', 'food', 'exercise', 'sleep', 'medication', 'other'],
  },
  time: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reminder', ReminderSchema);