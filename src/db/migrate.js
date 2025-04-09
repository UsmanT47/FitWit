const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const schema = require('./schema');

const connectionString = process.env.DATABASE_URL;

const runMigration = async () => {
  try {
    console.log('Running database migration...');
    
    // For migrations we use a separate connection with more privileges
    const migrationClient = postgres(connectionString, { max: 1 });
    
    // Create gender enum
    console.log('Creating enums...');
    try {
      await migrationClient`
        DO $$ BEGIN
          CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('- Gender enum created');
    } catch (err) {
      console.log('- Gender enum creation skipped:', err.message);
    }
    
    // Create activity_level enum
    try {
      await migrationClient`
        DO $$ BEGIN
          CREATE TYPE activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('- Activity level enum created');
    } catch (err) {
      console.log('- Activity level enum creation skipped:', err.message);
    }
    
    // Create fitness_goal enum
    try {
      await migrationClient`
        DO $$ BEGIN
          CREATE TYPE fitness_goal AS ENUM ('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'endurance');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('- Fitness goal enum created');
    } catch (err) {
      console.log('- Fitness goal enum creation skipped:', err.message);
    }
    
    // Create unit_system enum
    try {
      await migrationClient`
        DO $$ BEGIN
          CREATE TYPE unit_system AS ENUM ('metric', 'imperial');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('- Unit system enum created');
    } catch (err) {
      console.log('- Unit system enum creation skipped:', err.message);
    }
    
    // Create mood enum
    try {
      await migrationClient`
        DO $$ BEGIN
          CREATE TYPE mood AS ENUM ('happy', 'calm', 'sad', 'stressed', 'angry', 'neutral');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      console.log('- Mood enum created');
    } catch (err) {
      console.log('- Mood enum creation skipped:', err.message);
    }
    
    // Create users table
    console.log('Creating tables...');
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          date_of_birth DATE,
          gender gender,
          height REAL,
          weight REAL,
          activity_level activity_level DEFAULT 'moderate',
          fitness_goal fitness_goal DEFAULT 'maintenance',
          unit_system unit_system DEFAULT 'metric',
          preferences JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Users table created');
    } catch (err) {
      console.log('- Users table creation skipped:', err.message);
    }
    
    // Create food_logs table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS food_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          calories INTEGER,
          protein REAL,
          carbs REAL,
          fat REAL,
          fiber REAL,
          sugar REAL,
          sodium REAL,
          meal_type VARCHAR(50),
          date DATE NOT NULL,
          time VARCHAR(10),
          notes TEXT,
          image_url VARCHAR(255),
          barcode_data VARCHAR(100),
          nutrition_api_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Food logs table created');
    } catch (err) {
      console.log('- Food logs table creation skipped:', err.message);
    }
    
    // Create exercise_logs table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS exercise_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100),
          duration INTEGER,
          distance REAL,
          calories_burned INTEGER,
          heart_rate INTEGER,
          steps INTEGER,
          date DATE NOT NULL,
          time VARCHAR(10),
          notes TEXT,
          source VARCHAR(50),
          external_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Exercise logs table created');
    } catch (err) {
      console.log('- Exercise logs table creation skipped:', err.message);
    }
    
    // Create mood_logs table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS mood_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          mood mood NOT NULL,
          intensity INTEGER,
          factors JSONB,
          date DATE NOT NULL,
          time VARCHAR(10),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Mood logs table created');
    } catch (err) {
      console.log('- Mood logs table creation skipped:', err.message);
    }
    
    // Create sleep_logs table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS sleep_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          start_time TIMESTAMP NOT NULL,
          end_time TIMESTAMP NOT NULL,
          duration INTEGER,
          quality INTEGER,
          deep_sleep INTEGER,
          light_sleep INTEGER,
          rem_sleep INTEGER,
          awake_duration INTEGER,
          date DATE NOT NULL,
          notes TEXT,
          source VARCHAR(50),
          external_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Sleep logs table created');
    } catch (err) {
      console.log('- Sleep logs table creation skipped:', err.message);
    }
    
    // Create water_logs table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS water_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          amount REAL NOT NULL,
          unit VARCHAR(20) NOT NULL DEFAULT 'ml',
          date DATE NOT NULL,
          time VARCHAR(10),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Water logs table created');
    } catch (err) {
      console.log('- Water logs table creation skipped:', err.message);
    }
    
    // Create reminders table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS reminders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          title VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          time VARCHAR(10) NOT NULL,
          days JSONB,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Reminders table created');
    } catch (err) {
      console.log('- Reminders table creation skipped:', err.message);
    }
    
    // Create insights table
    try {
      await migrationClient`
        CREATE TABLE IF NOT EXISTS insights (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          type VARCHAR(50) NOT NULL,
          title VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          priority INTEGER DEFAULT 1,
          metadata JSONB,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('- Insights table created');
    } catch (err) {
      console.log('- Insights table creation skipped:', err.message);
    }
    
    // This will create all the tables if they don't exist
    console.log('Initializing Drizzle...');
    const db = drizzle(migrationClient, { schema });
    
    console.log('Running Drizzle migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
runMigration();