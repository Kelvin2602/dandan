/**
 * Script để seed navigation data vào database
 * Chạy: npx tsx scripts/seed-navigation.ts
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const NAV_DATA = [
  { id: 'home', label: '首页', path: '/' },
  {
    id: 'info',
    label: '信息公开',
    path: '/info',
    children: [
      { id: 'i1', label: '网络资料下载', path: '/info/download' },
      { id: 'i2', label: '财务工作报告', path: '/info/financial' },
      { id: 'i3', label: '年度工作报告', path: '/info/annual' },
      { id: 'i4', label: '收支明细', path: '/info/transactions' }
    ]
  },
  {
    id: 'news',
    label: '新闻中心',
    path: '/news',
    children: [
      { id: 'n1', label: '慈善资讯', path: '/news/charity' },
      { id: 'n2', label: '媒体报道', path: '/news/media' },
      { id: 'n3', label: '区县动态', path: '/news/district' }
    ]
  },
  { id: 'projects', label: '慈善项目', path: '/projects' },
  { id: 'funds', label: '公益基金', path: '/funds' },
  { id: 'volunteer', label: '志愿服务', path: '/volunteer' },
  { id: 'about', label: '机构介绍', path: '/about' }
];

async function seedNavigation() {
  try {
    console.log('🔄 Connecting to database...');
    await pool.connect();
    
    console.log('📝 Inserting navigation data...');
    
    // Insert or update navigation
    await pool.query(
      `INSERT INTO site_config (key, value) 
       VALUES ($1, $2) 
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_at = NOW()`,
      ['navigation', JSON.stringify(NAV_DATA)]
    );
    
    console.log('✅ Navigation data seeded successfully!');
    
    // Verify
    const result = await pool.query(
      `SELECT value FROM site_config WHERE key = 'navigation'`
    );
    
    if (result.rows.length > 0) {
      console.log('✓ Verification passed. Navigation data:');
      console.log(JSON.stringify(result.rows[0].value, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error seeding navigation:', error);
  } finally {
    await pool.end();
  }
}

seedNavigation();
