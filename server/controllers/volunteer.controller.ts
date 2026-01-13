import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getVolunteers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id, name, phone, email, skills as "interest", status,
        '西安' as "area", joined_at as "date"
      FROM volunteers
      ORDER BY joined_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Volunteers Error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
};

export const createVolunteer = async (req: Request, res: Response) => {
  const { name, phone, email, skills, interest } = req.body;
  try {
    const insertResult = await pool.query(
      `
            INSERT INTO volunteers (name, phone, email, skills, status, joined_at)
            VALUES ($1, $2, $3, $4, 'pending', NOW())
            RETURNING id
        `,
      [name, phone, email, skills || interest]
    );

    const newId = insertResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT
            id, name, phone, email, skills as "interest", status,
            '西安' as "area", joined_at as "date"
          FROM volunteers
          WHERE id = $1
        `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create volunteer application' });
  }
};

export const updateVolunteerStatus = async (req: Request, res: Response) => {
  const { status } = req.body; // 'approved' | 'rejected'
  try {
    const updateResult = await pool.query(
      `
            UPDATE volunteers SET status = $1 WHERE id = $2 RETURNING id
        `,
      [status, req.params.id]
    );

    if (updateResult.rows.length === 0)
      return res.status(404).json({ error: 'Volunteer not found' });

    const id = updateResult.rows[0].id;

    const result = await pool.query(
      `
          SELECT
            id, name, phone, email, skills as "interest", status,
            '西安' as "area", joined_at as "date"
          FROM volunteers
          WHERE id = $1
        `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update volunteer status' });
  }
};

export const deleteVolunteer = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM volunteers WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
};
