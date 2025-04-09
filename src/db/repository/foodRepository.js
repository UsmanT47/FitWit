import { db } from '../index';
import { foodLogs } from '../schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class FoodRepository {
  // Get food log by ID
  async getFoodLogById(id) {
    try {
      const result = await db.select().from(foodLogs).where(eq(foodLogs.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting food log by ID:', error);
      throw error;
    }
  }

  // Get food logs by user ID
  async getFoodLogsByUserId(userId) {
    try {
      const result = await db.select().from(foodLogs).where(eq(foodLogs.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting food logs by user ID:', error);
      throw error;
    }
  }

  // Get food logs by date range
  async getFoodLogsByDateRange(userId, startDate, endDate) {
    try {
      const result = await db
        .select()
        .from(foodLogs)
        .where(
          and(
            eq(foodLogs.userId, userId),
            gte(foodLogs.date, startDate),
            lte(foodLogs.date, endDate)
          )
        );
      return result;
    } catch (error) {
      console.error('Error getting food logs by date range:', error);
      throw error;
    }
  }

  // Create food log
  async createFoodLog(foodLogData) {
    try {
      const result = await db.insert(foodLogs).values(foodLogData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating food log:', error);
      throw error;
    }
  }

  // Update food log
  async updateFoodLog(id, foodLogData) {
    try {
      const result = await db
        .update(foodLogs)
        .set(foodLogData)
        .where(eq(foodLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating food log:', error);
      throw error;
    }
  }

  // Delete food log
  async deleteFoodLog(id) {
    try {
      const result = await db
        .delete(foodLogs)
        .where(eq(foodLogs.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting food log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const foodRepository = new FoodRepository();