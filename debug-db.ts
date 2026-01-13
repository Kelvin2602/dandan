import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testQueries() {
  try {
    console.log('Connecting...');
    const client = await pool.connect();
    console.log('Connected.');
    
    console.log('Testing Projects Query...');
    try {
        const res = await client.query(`
          SELECT 
            p.id, p.title, p.image_url as "image", p.raised_amount as "raised", 
            p.target_amount as "target", p.donor_count as "donors", p.valid_date as "validDate", 
            c.name as "category", p.description, p.content, p.status
          FROM projects p
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.created_at DESC
        `);
        console.log('Projects count:', res.rows.length);
        if(res.rows.length > 0) console.log('Sample Project:', res.rows[0]);
    } catch(e) { console.error('Projects Query Failed:', e); }

    console.log('Testing News Query...');
    try {
        const res = await client.query(`
          SELECT 
            n.id, n.title, c.name as "category", n.summary, n.content, 
            n.image_url as "image", n.author as "source", n.published_at as "publishedAt", n.views
          FROM news n
          LEFT JOIN categories c ON n.category_id = c.id
          ORDER BY n.published_at DESC
        `);
        console.log('News count:', res.rows.length);
    } catch(e) { console.error('News Query Failed:', e); }

    client.release();
  } catch (err) {
    console.error('Connection Failed:', err);
  } finally {
    await pool.end();
  }
}

testQueries();
