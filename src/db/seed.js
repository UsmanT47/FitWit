// Import required dependencies
const { Pool } = require('pg');
const crypto = require('crypto');

// Create a direct database connection rather than using Drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');
    
    // Create a test user
    // In a real application, we would hash passwords properly with bcrypt
    const mockPassword = crypto.createHash('sha256').update('password123').digest('hex');
    
    // Use direct SQL query instead of Drizzle to avoid mapping issues
    const checkUserQuery = 'SELECT id FROM users WHERE email = $1';
    const checkUserResult = await pool.query(checkUserQuery, ['test@example.com']);
    
    if (checkUserResult.rows.length === 0) {
      const insertUserQuery = `
        INSERT INTO users (
          email, username, password, first_name, last_name, date_of_birth, 
          gender, height, weight, activity_level, fitness_goal, unit_system, 
          preferences, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
      `;
      
      const values = [
        'test@example.com',
        'testuser',
        mockPassword,
        'Test',
        'User',
        '1990-01-01',
        'prefer_not_to_say',
        175,
        70,
        'moderate',
        'maintenance',
        'metric',
        JSON.stringify({ notifications: true, darkMode: false }),
        new Date(),
        new Date()
      ];
      
      await pool.query(insertUserQuery, values);
      console.log('Test user created successfully!');
    } else {
      console.log('Test user already exists, skipping insertion.');
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run the seeding
seedDatabase();