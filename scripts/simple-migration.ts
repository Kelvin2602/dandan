/**
 * Simple Migration Script
 * Manually create essential tables and seed data
 */
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_FxuKOEG3i9YV@ep-cool-darkness-a148vh1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  const sql = neon(DATABASE_URL);

  console.log('🚀 Starting simple migration...\n');

  try {
    // Enable UUID extension
    console.log('1️⃣  Enabling UUID extension...');
    try {
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      console.log('   ✅ UUID extension enabled\n');
    } catch (e: any) {
      console.log('   ⚠️  UUID extension already exists\n');
    }

    // Create projects table
    console.log('2️⃣  Creating projects table...');
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        image TEXT,
        raised DECIMAL(12, 2) DEFAULT 0,
        target DECIMAL(12, 2) NOT NULL,
        donors INTEGER DEFAULT 0,
        valid_date VARCHAR(100),
        category VARCHAR(50),
        description TEXT,
        content TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ Projects table created\n');

    // Create funds table
    console.log('3️⃣  Creating funds table...');
    await sql`
      CREATE TABLE IF NOT EXISTS funds (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        image TEXT,
        sponsor VARCHAR(255) NOT NULL,
        raised DECIMAL(12, 2) DEFAULT 0,
        times INTEGER DEFAULT 0,
        created_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ Funds table created\n');

    // Create news table
    console.log('4️⃣  Creating news table...');
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        publish_date DATE NOT NULL,
        image TEXT,
        summary TEXT,
        content TEXT,
        source VARCHAR(100),
        category VARCHAR(50),
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ News table created\n');

    // Create donations table
    console.log('5️⃣  Creating donations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        donor_name VARCHAR(100) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        project_id UUID,
        project_title VARCHAR(255),
        pay_type VARCHAR(50),
        channel VARCHAR(50),
        donation_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ Donations table created\n');

    // Create volunteers table
    console.log('6️⃣  Creating volunteers table...');
    await sql`
      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        area VARCHAR(100),
        interest VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        registration_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ Volunteers table created\n');

    // Create notices table
    console.log('7️⃣  Creating notices table...');
    await sql`
      CREATE TABLE IF NOT EXISTS notices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        link VARCHAR(255) NOT NULL,
        icon VARCHAR(10) DEFAULT '📢',
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('   ✅ Notices table created\n');

    // Seed projects
    console.log('🌱 Seeding projects...');
    await sql`
      INSERT INTO projects (title, image, raised, target, donors, valid_date, category, description, content, status)
      VALUES 
        ('"中华慈善日"慈善市集义卖活动', 'https://picsum.photos/800/600?random=1', 2964.04, 500000, 41, '2025-09-08至2025-10-31', 'activity', 
          '在每个社区，集中开展为期一天的"慈善服务日"，并围绕核心需求，再开展5场不同主题的专场服务',
          '<p>为了庆祝中华慈善日，我们将举行大型义卖活动。</p>', 'active'),
        ('致敬英雄，爱心传递--为见义勇为英雄李静毅家庭募捐', 'https://picsum.photos/800/600?random=2', 57402.86, 3000000, 911, '2025-07-29至2025-10-29', 'aid',
          '我们呼吁全市爱心企业、社会各界人士伸出援手',
          '<p>英雄流血不流泪。</p>', 'active')
      ON CONFLICT DO NOTHING
    `;
    console.log('   ✅ 2 projects seeded\n');

    // Seed notices
    console.log('🌱 Seeding notices...');
    await sql`
      INSERT INTO notices (content, link, icon, display_order)
      VALUES 
        ('长安仁爱慈善基金会郑重声明：谨防诈骗', '/news/n1', '📢', 1),
        ('热烈庆祝长安仁爱慈善基金会持续运营超过25周年', '/about', '📢', 2),
        ('慈善帮扶解难忧，锦旗回馈话初心', '/news/n2', '📢', 3)
      ON CONFLICT DO NOTHING
    `;
    console.log('   ✅ 3 notices seeded\n');

    // Verify
    console.log('🔍 Verifying...');
    const projectCount = await sql`SELECT COUNT(*)::int as count FROM projects`;
    const noticeCount = await sql`SELECT COUNT(*)::int as count FROM notices`;
    console.log(`   Projects: ${projectCount[0].count}`);
    console.log(`   Notices: ${noticeCount[0].count}\n`);

    console.log('✨ Migration completed!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrate();
