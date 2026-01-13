import 'dotenv/config';
import { sql } from '../database/db';

async function initAuth() {
    try {
        console.log('Creating admin_users table...');
        await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        console.log('Seeding admin user...');
        // "123456" as password (plain text as agreed for prototype)
        await sql`
      INSERT INTO admin_users (username, password)
      VALUES ('admin', '123456')
      ON CONFLICT (username) DO NOTHING;
    `;

        console.log('✅ Auth initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}

initAuth();
