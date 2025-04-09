import { db } from '../index';
import { sleepLogs } from '../schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class SleepRepository {
  // Get sleep log by ID
  async getSleepLogById(id) {
    try {
      const result = await db.select().from(sleepLogs).where(eq(sleepLogs.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting sleep log by ID:', error);
      throw error;
    }
  }

  // Get sleep logs by user ID
  async getSleepLogsByUserId(userId) {
    try {
      const result = await db.select().from(sleepLogs).where(eq(sleepLogs.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting sleep logs by user ID:', error);
      throw error;
    }
  }

  // Get sleep logs by date range
  async getSleepLogsByDateRange(userId, startDate, endDate) {
    try {
      const result = await db
        .select()
        .from(sleepLogs)
        .where(
          and(
            eq(sleepLogs.userId, userId),
            gte(sleepLogs.date, startDate),
            lte(sleepLogs.date, endDate)
          )
        );
      return result;
    } catch (error) {
      console.error('Error getting sleep logs by date range:', error);
      throw error;
    }
  }

  // Create sleep log
  async createSleepLog(sleepLogData) {
    try {
      const result = await db.insert(sleepLogs).values(sleepLogData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating sleep log:', error);
      throw error;
    }
  }

  // Update sleep log
  async updateSleepLog(id, sleepLogData) {
    try {
      const result = await db
        .update(sleepLogs)
        .set(sleepLogData)
        .where(eq(sleepLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating sleep log:', error);
      throw error;
    }
  }

  // Delete sleep log
  async deleteSleepLog(id) {
    try {
      const result = await db
        .delete(sleepLogs)
        .where(eq(sleepLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting sleep log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sleepRepository = new SleepRepository();