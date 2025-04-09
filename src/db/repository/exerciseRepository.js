import { db } from '../index';
import { exerciseLogs } from '../schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class ExerciseRepository {
  // Get exercise log by ID
  async getExerciseLogById(id) {
    try {
      const result = await db.select().from(exerciseLogs).where(eq(exerciseLogs.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting exercise log by ID:', error);
      throw error;
    }
  }

  // Get exercise logs by user ID
  async getExerciseLogsByUserId(userId) {
    try {
      const result = await db.select().from(exerciseLogs).where(eq(exerciseLogs.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting exercise logs by user ID:', error);
      throw error;
    }
  }

  // Get exercise logs by date range
  async getExerciseLogsByDateRange(userId, startDate, endDate) {
    try {
      const result = await db
        .select()
        .from(exerciseLogs)
        .where(
          and(
            eq(exerciseLogs.userId, userId),
            gte(exerciseLogs.date, startDate),
            lte(exerciseLogs.date, endDate)
          )
        );
      return result;
    } catch (error) {
      console.error('Error getting exercise logs by date range:', error);
      throw error;
    }
  }

  // Create exercise log
  async createExerciseLog(exerciseLogData) {
    try {
      const result = await db.insert(exerciseLogs).values(exerciseLogData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating exercise log:', error);
      throw error;
    }
  }

  // Update exercise log
  async updateExerciseLog(id, exerciseLogData) {
    try {
      const result = await db
        .update(exerciseLogs)
        .set(exerciseLogData)
        .where(eq(exerciseLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating exercise log:', error);
      throw error;
    }
  }

  // Delete exercise log
  async deleteExerciseLog(id) {
    try {
      const result = await db
        .delete(exerciseLogs)
        .where(eq(exerciseLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting exercise log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const exerciseRepository = new ExerciseRepository();