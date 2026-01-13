import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getDonations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        d.id, d.donor_name as "donorName", d.amount, d.message,
        d.project_id as "projectId", p.title as "projectTitle",
        d.payment_method as "paymentMethod", d.created_at as "createdAt", d.status
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Donations Error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

export const createDonation = async (req: Request, res: Response) => {
  const { donorName, amount, message, projectId, paymentMethod } = req.body;
  try {
    // 1. Insert Donation
    const insertResult = await pool.query(
      `
      INSERT INTO donations (donor_name, amount, message, project_id, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, 'completed')
      RETURNING id
    `,
      [donorName || 'Anonymous', amount, message, projectId, paymentMethod]
    );

    const newId = insertResult.rows[0].id;

    // 2. Update Project stats if projectId is present
    if (projectId) {
      await pool.query(
        `
        UPDATE projects
        SET raised_amount = raised_amount + $1, donor_count = donor_count + 1
        WHERE id = $2
      `,
        [amount, projectId]
      );
    }

    // 3. Fetch full object for consistency
    const result = await pool.query(
      `
      SELECT
        d.id, d.donor_name as "donorName", d.amount, d.message,
        d.project_id as "projectId", p.title as "projectTitle",
        d.payment_method as "paymentMethod", d.created_at as "createdAt", d.status
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      WHERE d.id = $1
    `,
      [newId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ error: 'Donation failed' });
  }
};
