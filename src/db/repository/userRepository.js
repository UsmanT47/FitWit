import { db } from '../index';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

// User repository class to handle all user-related database operations
export class UserRepository {
  // Get user by ID
  async getUserById(id) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      const result = await db.insert(users).values(userData).returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id, userData) {
    try {
      const result = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(id, preferences) {
    try {
      const user = await this.getUserById(id);
      if (!user) return null;

      const updatedPreferences = { ...user.preferences, ...preferences };
      
      const result = await db
        .update(users)
        .set({ preferences: updatedPreferences })
        .where(eq(users.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const result = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository();