import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.title, p.image_url as "image", p.raised_amount as "raised",
        p.target_amount as "target", p.donor_count as "donors", p.valid_date as "validDate",
        c.name as "category", p.description, p.content, p.status, p.category_id as "categoryId"
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Projects Error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id, p.title, p.image_url as "image", p.raised_amount as "raised",
        p.target_amount as "target", p.donor_count as "donors", p.valid_date as "validDate",
        c.name as "category", p.description, p.content, p.status, p.category_id as "categoryId"
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `,
      [req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const { title, image, target, validDate, categoryId, description, content, status } = req.body;
  try {
    const insertResult = await pool.query(
      `
        INSERT INTO projects (title, image_url, target_amount, valid_date, category_id, description, content, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
      [title, image, target, validDate, categoryId, description, content, status || 'fundraising']
    );

    const newId = insertResult.rows[0].id;

    // Fetch full object to ensure consistency
    const result = await pool.query(
      `
        SELECT
          p.id, p.title, p.image_url as "image", p.raised_amount as "raised",
          p.target_amount as "target", p.donor_count as "donors", p.valid_date as "validDate",
          c.name as "category", p.description, p.content, p.status, p.category_id as "categoryId"
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
      `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { title, image, target, validDate, categoryId, description, content, status } = req.body;
  try {
    const updateResult = await pool.query(
      `
        UPDATE projects
        SET title=$1, image_url=$2, target_amount=$3, valid_date=$4, category_id=$5, description=$6, content=$7, status=$8, updated_at=NOW()
        WHERE id = $9
        RETURNING id
      `,
      [title, image, target, validDate, categoryId, description, content, status, req.params.id]
    );

    if (updateResult.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    const id = updateResult.rows[0].id;

    // Fetch full object
    const result = await pool.query(
      `
        SELECT
          p.id, p.title, p.image_url as "image", p.raised_amount as "raised",
          p.target_amount as "target", p.donor_count as "donors", p.valid_date as "validDate",
          c.name as "category", p.description, p.content, p.status, p.category_id as "categoryId"
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
