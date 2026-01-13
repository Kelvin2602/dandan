import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getFunds = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id, name as "title", image_url as "image", total_amount as "raised",
        manager as "sponsor", created_at as "date", 0 as "times"
      FROM funds
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Funds Error:', error);
    res.status(500).json({ error: 'Failed to fetch funds' });
  }
};

export const createFund = async (req: Request, res: Response) => {
  const { title, image, raised, sponsor } = req.body;
  try {
    const insertResult = await pool.query(
      `
            INSERT INTO funds (name, image_url, total_amount, manager)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `,
      [title, image, raised || 0, sponsor]
    );

    const newId = insertResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT
            id, name as "title", image_url as "image", total_amount as "raised",
            manager as "sponsor", created_at as "date", 0 as "times"
          FROM funds
          WHERE id = $1
        `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create fund' });
  }
};

export const updateFund = async (req: Request, res: Response) => {
  const { title, image, raised, sponsor } = req.body;
  try {
    const updateResult = await pool.query(
      `
            UPDATE funds
            SET name=$1, image_url=$2, total_amount=$3, manager=$4
            WHERE id = $5
            RETURNING id
        `,
      [title, image, raised, sponsor, req.params.id]
    );

    if (updateResult.rows.length === 0) return res.status(404).json({ error: 'Fund not found' });

    const id = updateResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT
            id, name as "title", image_url as "image", total_amount as "raised",
            manager as "sponsor", created_at as "date", 0 as "times"
          FROM funds
          WHERE id = $1
        `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update fund' });
  }
};

export const deleteFund = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM funds WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete fund' });
  }
};
