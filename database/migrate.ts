import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting migration...\n');
    
    // Step 1: Run schema.sql
    console.log('📋 Running schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');
    console.log('✅ Schema applied successfully.\n');

    // Step 2: Verify navigation data exists
    console.log('🔍 Verifying navigation data...');
    const navCheck = await client.query(
      `SELECT value FROM site_config WHERE key = 'navigation'`
    );
    
    if (navCheck.rows.length > 0) {
      console.log('✅ Navigation already exists in database.\n');
    } else {
      console.log('⚠️  Navigation not found in schema seed.');
      console.log('💡 Tip: Run "npx tsx scripts/seed-navigation.ts" to add navigation.\n');
    }

    console.log('✅ Migration completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
