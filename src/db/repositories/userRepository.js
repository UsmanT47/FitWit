// User repository for database operations
const { db } = require('../index');
const { users } = require('../schema');
const { eq } = require('drizzle-orm');
const crypto = require('crypto');

/**
 * Find a user by ID
 * @param {Number} id User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findById(id) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

/**
 * Find a user by email
 * @param {String} email User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findByEmail(email) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Find a user by username
 * @param {String} username Username
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findByUsername(username) {
  try {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
}

/**
 * Create a new user
 * @param {Object} userData User data
 * @returns {Promise<Object>} Created user object
 */
async function create(userData) {
  try {
    // In a real app, use a proper password hashing library like bcrypt
    const hashedPassword = crypto.createHash('sha256').update(userData.password).digest('hex');
    
    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update a user
 * @param {Number} id User ID
 * @param {Object} userData Updated user data
 * @returns {Promise<Object>} Updated user object
 */
async function update(id, userData) {
  try {
    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };
    
    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
      
    return result[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user
 * @param {Number} id User ID
 * @returns {Promise<Boolean>} True if deleted, false otherwise
 */
async function remove(id) {
  try {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Authenticate a user
 * @param {String} email User email
 * @param {String} password User password
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
async function authenticate(email, password) {
  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    const result = await db.select()
      .from(users)
      .where(eq(users.email, email));
    
    if (result.length === 0) {
      return null;
    }
    
    const user = result[0];
    
    if (user.password !== hashedPassword) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

module.exports = {
  findById,
  findByEmail,
  findByUsername,
  create,
  update,
  remove,
  authenticate,
};