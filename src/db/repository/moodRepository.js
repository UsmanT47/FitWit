import { db } from '../index';
import { moodLogs } from '../schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class MoodRepository {
  // Get mood log by ID
  async getMoodLogById(id) {
    try {
      const result = await db.select().from(moodLogs).where(eq(moodLogs.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting mood log by ID:', error);
      throw error;
    }
  }

  // Get mood logs by user ID
  async getMoodLogsByUserId(userId) {
    try {
      const result = await db.select().from(moodLogs).where(eq(moodLogs.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting mood logs by user ID:', error);
      throw error;
    }
  }

  // Get mood logs by date range
  async getMoodLogsByDateRange(userId, startDate, endDate) {
    try {
      const result = await db
        .select()
        .from(moodLogs)
        .where(
          and(
            eq(moodLogs.userId, userId),
            gte(moodLogs.date, startDate),
            lte(moodLogs.date, endDate)
          )
        );
      return result;
    } catch (error) {
      console.error('Error getting mood logs by date range:', error);
      throw error;
    }
  }

  // Create mood log
  async createMoodLog(moodLogData) {
    try {
      const result = await db.insert(moodLogs).values(moodLogData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating mood log:', error);
      throw error;
    }
  }

  // Update mood log
  async updateMoodLog(id, moodLogData) {
    try {
      const result = await db
        .update(moodLogs)
        .set(moodLogData)
        .where(eq(moodLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating mood log:', error);
      throw error;
    }
  }

  // Delete mood log
  async deleteMoodLog(id) {
    try {
      const result = await db
        .delete(moodLogs)
        .where(eq(moodLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting mood log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const moodRepository = new MoodRepository();