// Database connection 
const { Pool } = require('pg');
const dbConfig = require('../config/db.config');
const pool = new Pool(dbConfig);

// Test database connection
pool.connect()
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));

// Create tables if they don't exist
const initDb = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        encrypted_email TEXT NOT NULL UNIQUE,
        encrypted_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        encrypted_title TEXT NOT NULL,
        encrypted_content TEXT NOT NULL,
        hmac_signature TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};