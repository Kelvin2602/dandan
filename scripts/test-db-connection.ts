/**
 * Test NeonDB Connection
 * Simple script to verify database connectivity
 */
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_FxuKOEG3i9YV@ep-cool-darkness-a148vh1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
  console.log('🔌 Testing NeonDB connection...\n');
  
  try {
    const sql = neon(DATABASE_URL);
    
    // Test query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    console.log('✅ Connection successful!\n');
    console.log('📅 Server time:', result[0].current_time);
    console.log('🗄️  PostgreSQL version:', result[0].pg_version);
    console.log('\n✨ Database is ready for migration!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:\n');
    console.error(error);
    console.log('\n💡 Tips:');
    console.log('  1. Check if CONNECTION_STRING is correct');
    console.log('  2. Verify Neon project is active');
    console.log('  3. Check network/firewall settings\n');
    return false;
  }
}

testConnection();
