import bcrypt from 'bcryptjs';

import { getPool, testConnection } from '../database/connection-pool.js';

async function fixAdminPassword() {
  try {
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    const pool = getPool();
    // Generate new hash for password "admin"
    const newHash = await bcrypt.hash('admin', 10);
    console.log('Generated new hash:', newHash);
    
    // Update database
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2',
      [newHash, 'admin']
    );
    
    console.log('✅ Password updated for admin user');
    console.log('Rows affected:', result.rowCount);
    
    // Test the new hash
    const testResult = await bcrypt.compare('admin', newHash);
    console.log('✅ Password verification test:', testResult);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAdminPassword();