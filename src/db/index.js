const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const schema = require('./schema');

// Database connection using environment variables
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

// Initialize database function to make sure tables are created
const initializeDatabase = async () => {
  try {
    console.log('Initializing database connection...');
    // Test the connection
    await client`SELECT 1`;
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Export database and functions
module.exports = {
  db,
  initializeDatabase
};