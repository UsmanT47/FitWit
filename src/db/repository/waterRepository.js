import { db } from '../index';
import { waterLogs } from '../schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class WaterRepository {
  // Get water log by ID
  async getWaterLogById(id) {
    try {
      const result = await db.select().from(waterLogs).where(eq(waterLogs.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting water log by ID:', error);
      throw error;
    }
  }

  // Get water logs by user ID
  async getWaterLogsByUserId(userId) {
    try {
      const result = await db.select().from(waterLogs).where(eq(waterLogs.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting water logs by user ID:', error);
      throw error;
    }
  }

  // Get water logs by date range
  async getWaterLogsByDateRange(userId, startDate, endDate) {
    try {
      const result = await db
        .select()
        .from(waterLogs)
        .where(
          and(
            eq(waterLogs.userId, userId),
            gte(waterLogs.date, startDate),
            lte(waterLogs.date, endDate)
          )
        );
      return result;
    } catch (error) {
      console.error('Error getting water logs by date range:', error);
      throw error;
    }
  }

  // Create water log
  async createWaterLog(waterLogData) {
    try {
      const result = await db.insert(waterLogs).values(waterLogData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating water log:', error);
      throw error;
    }
  }

  // Update water log
  async updateWaterLog(id, waterLogData) {
    try {
      const result = await db
        .update(waterLogs)
        .set(waterLogData)
        .where(eq(waterLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating water log:', error);
      throw error;
    }
  }

  // Delete water log
  async deleteWaterLog(id) {
    try {
      const result = await db
        .delete(waterLogs)
        .where(eq(waterLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting water log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const waterRepository = new WaterRepository();