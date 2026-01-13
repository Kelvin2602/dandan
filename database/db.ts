/**
 * Database Connection Utility using Neon Serverless
 * Hỗ trợ connection pooling và error handling
 */
const DATABASE_URL = (import.meta as any).env?.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
export const sql = async (strings: TemplateStringsArray | string, ...values: any[]) => {
  if (typeof strings === 'string') {
    const result = await pool.query(strings, values);
    return result.rows;
  }
  let query = strings[0];
  for (let i = 1; i < strings.length; i++) {
    query += `$${i}` + strings[i];
  }
  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Execute raw SQL query with error handling
 * @param query SQL query string
 * @param params Query parameters
 * @returns Query result
 */



/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return sql(query, ...params) as Promise<T[]>;
}

// Helper: Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper: Parse decimal from database
export function parseDecimal(value: any): number {
  return typeof value === 'string' ? parseFloat(value) : value;
}
