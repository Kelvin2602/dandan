import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getSiteConfig = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_config');

    // Accumulate rows and parse JSON values
    const config: any = {};
    result.rows.forEach((row) => {
      try {
        // Parse JSON values (most config values are stored as JSON strings)
        config[row.key] = JSON.parse(row.value);
      } catch (e) {
        // If not valid JSON, use as string (fallback)
        config[row.key] = row.value;
      }
    });

    // 2. Try to get banners/notices from site_config first
    if (!config.banners) {
      // Fallback to banners table
      const bannersResult = await pool.query(
        'SELECT image_url FROM banners WHERE is_active = true ORDER BY sort_order'
      );
      if (bannersResult.rows.length > 0) {
        config.banners = bannersResult.rows.map((r) => r.image_url);
      } else {
        config.banners = [
          'https://picsum.photos/1200/400?random=101',
          'https://picsum.photos/1200/400?random=102',
        ];
      }
    }

    if (!config.notices) {
      // Fallback to notices table
      const noticesResult = await pool.query(
        'SELECT id, content, link_url as "link" FROM notices WHERE is_active = true ORDER BY created_at DESC LIMIT 5'
      );
      if (noticesResult.rows.length > 0) {
        config.notices = noticesResult.rows;
      } else {
        config.notices = [{ id: '1', content: '暂无公告信息，请在后台添加...', link: '#' }];
      }
    }

    res.json(config);
  } catch (error) {
    console.error('SiteConfig Error:', error);
    res.status(500).json({ error: 'Failed to fetch site config' });
  }
};

export const updateSiteConfig = async (req: Request, res: Response) => {
  const config = req.body;
  try {
    await pool.query('BEGIN');

    const keys = [
      'header',
      'footer',
      'baseStats',
      'banners',
      'notices',
      'headerImage',
      'navigation',
      'qualifications',
      'donationQRs',
      'projectsBanner',
    ];
    for (const key of keys) {
      if (config[key]) {
        await pool.query(
          `INSERT INTO site_config (key, value) VALUES ($1, $2)
                     ON CONFLICT (key) DO UPDATE SET value = $2`,
          [key, JSON.stringify(config[key])]
        );
      }
    }

    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to update site config' });
  }
};
