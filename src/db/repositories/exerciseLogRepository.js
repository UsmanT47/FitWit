// Exercise log repository for database operations
const { db } = require('../index');
const { exerciseLogs } = require('../schema');
const { eq, and, gte, lte, desc } = require('drizzle-orm');

/**
 * Create a new exercise log entry
 * @param {Object} exerciseData Exercise log data
 * @returns {Promise<Object>} Created exercise log entry
 */
async function create(exerciseData) {
  try {
    const newExerciseLog = {
      ...exerciseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.insert(exerciseLogs).values(newExerciseLog).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating exercise log:', error);
    throw error;
  }
}

/**
 * Get exercise log by ID
 * @param {Number} id Exercise log ID
 * @param {Number} userId User ID
 * @returns {Promise<Object|null>} Exercise log entry or null if not found
 */
async function findById(id, userId) {
  try {
    const result = await db.select()
      .from(exerciseLogs)
      .where(and(
        eq(exerciseLogs.id, id),
        eq(exerciseLogs.userId, userId)
      ));
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding exercise log by ID:', error);
    throw error;
  }
}

/**
 * Get exercise logs for a user for a specific date
 * @param {Number} userId User ID
 * @param {String} date Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of exercise log entries
 */
async function findByDate(userId, date) {
  try {
    const result = await db.select()
      .from(exerciseLogs)
      .where(and(
        eq(exerciseLogs.userId, userId),
        eq(exerciseLogs.date, date)
      ))
      .orderBy(desc(exerciseLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding exercise logs by date:', error);
    throw error;
  }
}

/**
 * Get exercise logs for a user for a date range
 * @param {Number} userId User ID
 * @param {String} startDate Start date in YYYY-MM-DD format
 * @param {String} endDate End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of exercise log entries
 */
async function findByDateRange(userId, startDate, endDate) {
  try {
    const result = await db.select()
      .from(exerciseLogs)
      .where(and(
        eq(exerciseLogs.userId, userId),
        gte(exerciseLogs.date, startDate),
        lte(exerciseLogs.date, endDate)
      ))
      .orderBy(desc(exerciseLogs.date), desc(exerciseLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding exercise logs by date range:', error);
    throw error;
  }
}

/**
 * Get exercise logs for a user by type
 * @param {Number} userId User ID
 * @param {String} type Exercise type
 * @returns {Promise<Array>} Array of exercise log entries
 */
async function findByType(userId, type) {
  try {
    const result = await db.select()
      .from(exerciseLogs)
      .where(and(
        eq(exerciseLogs.userId, userId),
        eq(exerciseLogs.type, type)
      ))
      .orderBy(desc(exerciseLogs.date), desc(exerciseLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding exercise logs by type:', error);
    throw error;
  }
}

/**
 * Update an exercise log entry
 * @param {Number} id Exercise log ID
 * @param {Number} userId User ID
 * @param {Object} exerciseData Updated exercise log data
 * @returns {Promise<Object>} Updated exercise log entry
 */
async function update(id, userId, exerciseData) {
  try {
    const updateData = {
      ...exerciseData,
      updatedAt: new Date(),
    };
    
    const result = await db.update(exerciseLogs)
      .set(updateData)
      .where(and(
        eq(exerciseLogs.id, id),
        eq(exerciseLogs.userId, userId)
      ))
      .returning();
      
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error updating exercise log:', error);
    throw error;
  }
}

/**
 * Delete an exercise log entry
 * @param {Number} id Exercise log ID
 * @param {Number} userId User ID
 * @returns {Promise<Boolean>} True if deleted, false otherwise
 */
async function remove(id, userId) {
  try {
    const result = await db.delete(exerciseLogs)
      .where(and(
        eq(exerciseLogs.id, id),
        eq(exerciseLogs.userId, userId)
      ))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting exercise log:', error);
    throw error;
  }
}

module.exports = {
  create,
  findById,
  findByDate,
  findByDateRange,
  findByType,
  update,
  remove,
};