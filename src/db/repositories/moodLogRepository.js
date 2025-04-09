// Mood log repository for database operations
const { db } = require('../index');
const { moodLogs } = require('../schema');
const { eq, and, gte, lte, desc } = require('drizzle-orm');

/**
 * Create a new mood log entry
 * @param {Object} moodData Mood log data
 * @returns {Promise<Object>} Created mood log entry
 */
async function create(moodData) {
  try {
    const newMoodLog = {
      ...moodData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.insert(moodLogs).values(newMoodLog).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating mood log:', error);
    throw error;
  }
}

/**
 * Get mood log by ID
 * @param {Number} id Mood log ID
 * @param {Number} userId User ID
 * @returns {Promise<Object|null>} Mood log entry or null if not found
 */
async function findById(id, userId) {
  try {
    const result = await db.select()
      .from(moodLogs)
      .where(and(
        eq(moodLogs.id, id),
        eq(moodLogs.userId, userId)
      ));
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding mood log by ID:', error);
    throw error;
  }
}

/**
 * Get mood logs for a user for a specific date
 * @param {Number} userId User ID
 * @param {String} date Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of mood log entries
 */
async function findByDate(userId, date) {
  try {
    const result = await db.select()
      .from(moodLogs)
      .where(and(
        eq(moodLogs.userId, userId),
        eq(moodLogs.date, date)
      ))
      .orderBy(desc(moodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding mood logs by date:', error);
    throw error;
  }
}

/**
 * Get mood logs for a user for a date range
 * @param {Number} userId User ID
 * @param {String} startDate Start date in YYYY-MM-DD format
 * @param {String} endDate End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of mood log entries
 */
async function findByDateRange(userId, startDate, endDate) {
  try {
    const result = await db.select()
      .from(moodLogs)
      .where(and(
        eq(moodLogs.userId, userId),
        gte(moodLogs.date, startDate),
        lte(moodLogs.date, endDate)
      ))
      .orderBy(desc(moodLogs.date), desc(moodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding mood logs by date range:', error);
    throw error;
  }
}

/**
 * Get mood logs for a user by mood
 * @param {Number} userId User ID
 * @param {String} mood Mood value
 * @returns {Promise<Array>} Array of mood log entries
 */
async function findByMood(userId, mood) {
  try {
    const result = await db.select()
      .from(moodLogs)
      .where(and(
        eq(moodLogs.userId, userId),
        eq(moodLogs.mood, mood)
      ))
      .orderBy(desc(moodLogs.date), desc(moodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding mood logs by mood:', error);
    throw error;
  }
}

/**
 * Update a mood log entry
 * @param {Number} id Mood log ID
 * @param {Number} userId User ID
 * @param {Object} moodData Updated mood log data
 * @returns {Promise<Object>} Updated mood log entry
 */
async function update(id, userId, moodData) {
  try {
    const updateData = {
      ...moodData,
      updatedAt: new Date(),
    };
    
    const result = await db.update(moodLogs)
      .set(updateData)
      .where(and(
        eq(moodLogs.id, id),
        eq(moodLogs.userId, userId)
      ))
      .returning();
      
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error updating mood log:', error);
    throw error;
  }
}

/**
 * Delete a mood log entry
 * @param {Number} id Mood log ID
 * @param {Number} userId User ID
 * @returns {Promise<Boolean>} True if deleted, false otherwise
 */
async function remove(id, userId) {
  try {
    const result = await db.delete(moodLogs)
      .where(and(
        eq(moodLogs.id, id),
        eq(moodLogs.userId, userId)
      ))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting mood log:', error);
    throw error;
  }
}

module.exports = {
  create,
  findById,
  findByDate,
  findByDateRange,
  findByMood,
  update,
  remove,
};