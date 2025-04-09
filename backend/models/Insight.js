const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['sleep', 'nutrition', 'exercise', 'mood', 'hydration', 'general'],
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },
  metadata: {
    type: Object,
    default: {},
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Insight', InsightSchema);