const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default in queries
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say',
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'endurance'],
    default: 'maintenance',
  },
  unitSystem: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric',
  },
  preferences: {
    type: Object,
    default: {},
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // In a real app, use bcrypt instead of simple hashing
  const hashedPassword = crypto.createHash('sha256').update(enteredPassword).digest('hex');
  return this.password === hashedPassword;
};

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  // In a real app, use bcrypt instead of simple hashing
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
});

module.exports = mongoose.model('User', UserSchema);