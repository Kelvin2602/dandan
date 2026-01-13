/**
 * Centralized Database Connection Pool
 * Tuân thủ Database Architecture Standards từ .kiro/steering/database.md
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Singleton pattern cho connection pool
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required cho Neon serverless
      },
      // Performance optimization
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
    });

    // Connection event handlers
    pool.on('connect', () => {
      console.log('✅ New database connection established');
    });

    pool.on('error', (err) => {
      console.error('❌ Database pool error:', err);
    });
  }

  return pool;
}

/**
 * Graceful shutdown helper
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('🔒 Database pool closed');
  }
}

/**
 * Health check helper
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await getPool().connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}