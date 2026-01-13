import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getNews = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        n.id, n.title, c.name as "category", n.summary, n.content,
        n.image_url as "image", n.author as "source", n.published_at as "date", n.views,
        n.category_id as "categoryId"
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      ORDER BY n.published_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('News Error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

export const getNewsById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
        SELECT
          n.id, n.title, c.name as "category", n.summary, n.content,
          n.image_url as "image", n.author as "source", n.published_at as "date", n.views,
          n.category_id as "categoryId"
        FROM news n
        LEFT JOIN categories c ON n.category_id = c.id
        WHERE n.id = $1
      `,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news item' });
  }
};

export const createNews = async (req: Request, res: Response) => {
  const { title, categoryId, summary, content, image, author } = req.body;
  try {
    const insertResult = await pool.query(
      `
            INSERT INTO news (title, category_id, summary, content, image_url, author, published_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
        `,
      [title, categoryId, summary, content, image, author]
    );

    const newId = insertResult.rows[0].id;

    // Fetch full object
    const result = await pool.query(
      `
          SELECT
            n.id, n.title, c.name as "category", n.summary, n.content,
            n.image_url as "image", n.author as "source", n.published_at as "date", n.views,
            n.category_id as "categoryId"
          FROM news n
          LEFT JOIN categories c ON n.category_id = c.id
          WHERE n.id = $1
        `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create news' });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  const { title, categoryId, summary, content, image, author } = req.body;
  try {
    const updateResult = await pool.query(
      `
            UPDATE news
            SET title=$1, category_id=$2, summary=$3, content=$4, image_url=$5, author=$6
            WHERE id = $7
            RETURNING id
        `,
      [title, categoryId, summary, content, image, author, req.params.id]
    );

    if (updateResult.rows.length === 0) return res.status(404).json({ error: 'News not found' });

    const id = updateResult.rows[0].id;

    // Fetch full object
    const result = await pool.query(
      `
          SELECT
            n.id, n.title, c.name as "category", n.summary, n.content,
            n.image_url as "image", n.author as "source", n.published_at as "date", n.views,
            n.category_id as "categoryId"
          FROM news n
          LEFT JOIN categories c ON n.category_id = c.id
          WHERE n.id = $1
        `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update news' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
};
