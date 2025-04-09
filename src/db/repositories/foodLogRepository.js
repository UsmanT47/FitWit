// Food log repository for database operations
const { db } = require('../index');
const { foodLogs, users } = require('../schema');
const { eq, and, gte, lte, desc } = require('drizzle-orm');

/**
 * Create a new food log entry
 * @param {Object} foodData Food log data
 * @returns {Promise<Object>} Created food log entry
 */
async function create(foodData) {
  try {
    const newFoodLog = {
      ...foodData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.insert(foodLogs).values(newFoodLog).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating food log:', error);
    throw error;
  }
}

/**
 * Get food log by ID
 * @param {Number} id Food log ID
 * @param {Number} userId User ID
 * @returns {Promise<Object|null>} Food log entry or null if not found
 */
async function findById(id, userId) {
  try {
    const result = await db.select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.id, id),
        eq(foodLogs.userId, userId)
      ));
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding food log by ID:', error);
    throw error;
  }
}

/**
 * Get food logs for a user for a specific date
 * @param {Number} userId User ID
 * @param {String} date Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of food log entries
 */
async function findByDate(userId, date) {
  try {
    const result = await db.select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.userId, userId),
        eq(foodLogs.date, date)
      ))
      .orderBy(desc(foodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding food logs by date:', error);
    throw error;
  }
}

/**
 * Get food logs for a user for a date range
 * @param {Number} userId User ID
 * @param {String} startDate Start date in YYYY-MM-DD format
 * @param {String} endDate End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of food log entries
 */
async function findByDateRange(userId, startDate, endDate) {
  try {
    const result = await db.select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.userId, userId),
        gte(foodLogs.date, startDate),
        lte(foodLogs.date, endDate)
      ))
      .orderBy(desc(foodLogs.date), desc(foodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding food logs by date range:', error);
    throw error;
  }
}

/**
 * Update a food log entry
 * @param {Number} id Food log ID
 * @param {Number} userId User ID
 * @param {Object} foodData Updated food log data
 * @returns {Promise<Object>} Updated food log entry
 */
async function update(id, userId, foodData) {
  try {
    const updateData = {
      ...foodData,
      updatedAt: new Date(),
    };
    
    const result = await db.update(foodLogs)
      .set(updateData)
      .where(and(
        eq(foodLogs.id, id),
        eq(foodLogs.userId, userId)
      ))
      .returning();
      
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error updating food log:', error);
    throw error;
  }
}

/**
 * Delete a food log entry
 * @param {Number} id Food log ID
 * @param {Number} userId User ID
 * @returns {Promise<Boolean>} True if deleted, false otherwise
 */
async function remove(id, userId) {
  try {
    const result = await db.delete(foodLogs)
      .where(and(
        eq(foodLogs.id, id),
        eq(foodLogs.userId, userId)
      ))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting food log:', error);
    throw error;
  }
}

/**
 * Get food logs for a user by barcode
 * @param {Number} userId User ID
 * @param {String} barcode Barcode data
 * @returns {Promise<Array>} Array of food log entries
 */
async function findByBarcode(userId, barcode) {
  try {
    const result = await db.select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.userId, userId),
        eq(foodLogs.barcodeData, barcode)
      ))
      .orderBy(desc(foodLogs.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error finding food logs by barcode:', error);
    throw error;
  }
}

module.exports = {
  create,
  findById,
  findByDate,
  findByDateRange,
  update,
  remove,
  findByBarcode,
};