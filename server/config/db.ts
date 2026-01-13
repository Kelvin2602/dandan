import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables if not already loaded
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL Database');
        client.release();
    } catch (err) {
        console.error('❌ Database connection error:', err);
    }
};
