const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in query results by default
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    privacyMode: {
      type: Boolean,
      default: false,
    },
    waterGoal: {
      type: Number,
      default: 8,
    },
    sleepGoal: {
      type: Number,
      default: 8,
    },
  },
  streaks: {
    current: {
      type: Number,
      default: 0,
    },
    longest: {
      type: Number,
      default: 0,
    },
    lastLogDate: {
      type: Date,
      default: null,
    },
  },
  stats: {
    daysActive: {
      type: Number,
      default: 0,
    },
    totalLogs: {
      type: Number,
      default: 0,
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // Update the updated timestamp
    this.updated = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Add a method to check if password is correct
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Update streaks based on a new log
UserSchema.methods.updateStreaks = function (logDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const logDay = new Date(logDate);
  logDay.setHours(0, 0, 0, 0);
  
  const lastLogDate = this.streaks.lastLogDate;
  
  // If this is the first log, set streaks to 1
  if (!lastLogDate) {
    this.streaks.current = 1;
    this.streaks.longest = 1;
    this.streaks.lastLogDate = logDay;
    return;
  }
  
  const lastLogDay = new Date(lastLogDate);
  lastLogDay.setHours(0, 0, 0, 0);
  
  // If log is for today and we already logged today, no change
  if (logDay.getTime() === lastLogDay.getTime()) {
    return;
  }
  
  // If log is for a new day
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const dayDifference = Math.round((logDay - lastLogDay) / oneDayInMs);
  
  if (dayDifference === 1) {
    // Consecutive day, increase streak
    this.streaks.current += 1;
    if (this.streaks.current > this.streaks.longest) {
      this.streaks.longest = this.streaks.current;
    }
  } else if (dayDifference > 1) {
    // Streak broken, reset to 1
    this.streaks.current = 1;
  }
  
  this.streaks.lastLogDate = logDay;
};

// Create model from schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
