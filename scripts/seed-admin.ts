import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { sql, testConnection } from '../database/db';


const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function seedAdmin() {
  console.log('🔄 Starting Admin Seeding...');

  // 1. Test Connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Could not connect to database. Aborting.');
    process.exit(1);
  }

  try {
    // 2. Hash Password
    console.log(`🔐 Hashing password for user: ${ADMIN_USERNAME}`);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // 3. Upsert Admin User
    // We use ON CONFLICT to update if exists, or INSERT if new.
    // Assuming 'username' is UNIQUE in 'users' table.
    
    const result = await sql`
      INSERT INTO users (username, password_hash, role)
      VALUES (${ADMIN_USERNAME}, ${passwordHash}, 'admin')
      ON CONFLICT (username) 
      DO UPDATE SET 
        password_hash = ${passwordHash},
        role = 'admin'
      RETURNING id, username, role;
    `;

    console.log('✅ Admin user seeded successfully!');
    console.log('Details:', result[0]);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
