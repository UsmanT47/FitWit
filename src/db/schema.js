const { pgTable, serial, text, timestamp, integer, boolean, pgEnum, jsonb, varchar, date, real } = require('drizzle-orm/pg-core');

// Define enums
const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
const activityLevelEnum = pgEnum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active']);
const fitnessGoalEnum = pgEnum('fitness_goal', ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'endurance']);
const unitSystemEnum = pgEnum('unit_system', ['metric', 'imperial']);
const moodEnum = pgEnum('mood', ['happy', 'calm', 'sad', 'stressed', 'angry', 'neutral']);

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  height: real('height'),
  weight: real('weight'),
  activityLevel: activityLevelEnum('activity_level').default('moderate'),
  fitnessGoal: fitnessGoalEnum('fitness_goal').default('maintenance'),
  unitSystem: unitSystemEnum('unit_system').default('metric'),
  preferences: jsonb('preferences').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Food logs table
const foodLogs = pgTable('food_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  calories: integer('calories'),
  protein: real('protein'),
  carbs: real('carbs'),
  fat: real('fat'),
  fiber: real('fiber'),
  sugar: real('sugar'),
  sodium: real('sodium'),
  mealType: varchar('meal_type', { length: 50 }),
  date: date('date').notNull(),
  time: varchar('time', { length: 10 }),
  notes: text('notes'),
  imageUrl: varchar('image_url', { length: 255 }),
  barcodeData: varchar('barcode_data', { length: 100 }),
  nutritionApiData: jsonb('nutrition_api_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Exercise logs table
const exerciseLogs = pgTable('exercise_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }),
  duration: integer('duration'),
  distance: real('distance'),
  caloriesBurned: integer('calories_burned'),
  heartRate: integer('heart_rate'),
  steps: integer('steps'),
  date: date('date').notNull(),
  time: varchar('time', { length: 10 }),
  notes: text('notes'),
  source: varchar('source', { length: 50 }),
  externalData: jsonb('external_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Mood logs table
const moodLogs = pgTable('mood_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  mood: moodEnum('mood').notNull(),
  intensity: integer('intensity'),
  factors: jsonb('factors'),
  date: date('date').notNull(),
  time: varchar('time', { length: 10 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sleep logs table
const sleepLogs = pgTable('sleep_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  duration: integer('duration'),
  quality: integer('quality'),
  deepSleep: integer('deep_sleep'),
  lightSleep: integer('light_sleep'),
  remSleep: integer('rem_sleep'),
  awakeDuration: integer('awake_duration'),
  date: date('date').notNull(),
  notes: text('notes'),
  source: varchar('source', { length: 50 }),
  externalData: jsonb('external_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Water logs table
const waterLogs = pgTable('water_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: real('amount').notNull(),
  unit: varchar('unit', { length: 20 }).notNull().default('ml'),
  date: date('date').notNull(),
  time: varchar('time', { length: 10 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reminders table
const reminders = pgTable('reminders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  time: varchar('time', { length: 10 }).notNull(),
  days: jsonb('days'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// AI-generated insights table
const insights = pgTable('insights', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  priority: integer('priority').default(1),
  metadata: jsonb('metadata'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Export all tables and enums
module.exports = {
  genderEnum,
  activityLevelEnum,
  fitnessGoalEnum,
  unitSystemEnum,
  moodEnum,
  users,
  foodLogs,
  exerciseLogs,
  moodLogs,
  sleepLogs,
  waterLogs,
  reminders,
  insights
};