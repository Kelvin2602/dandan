import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getNotices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, content, type, link_url as "link", is_active as "isActive", created_at as "createdAt"
      FROM notices
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

export const getActiveNotices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT id, content, type, link_url as "link", is_active as "isActive", created_at as "createdAt"
        FROM notices
        WHERE is_active = true
        ORDER BY created_at DESC
      `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active notices' });
  }
};

export const createNotice = async (req: Request, res: Response) => {
  const { content, link, isActive } = req.body;
  try {
    const insertResult = await pool.query(
      `
            INSERT INTO notices (content, link_url, is_active, type)
            VALUES ($1, $2, $3, 'info')
            RETURNING id
        `,
      [content, link, isActive !== false]
    );

    const newId = insertResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT id, content, type, link_url as "link", is_active as "isActive", created_at as "createdAt"
          FROM notices
          WHERE id = $1
        `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  const { content, link, isActive } = req.body;
  try {
    const updateResult = await pool.query(
      `
            UPDATE notices
            SET content=$1, link_url=$2, is_active=$3
            WHERE id = $4
            RETURNING id
        `,
      [content, link, isActive, req.params.id]
    );

    if (updateResult.rows.length === 0) return res.status(404).json({ error: 'Notice not found' });

    const id = updateResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT id, content, type, link_url as "link", is_active as "isActive", created_at as "createdAt"
          FROM notices
          WHERE id = $1
        `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
