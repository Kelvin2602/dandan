import { Request, Response } from 'express';
import { pool } from '../config/db';

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date(), message: 'Backend is running correctly' });
};

export const testConnection = (req: Request, res: Response) => {
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: pool ? 'connected' : 'disconnected'
  });
};

export const getTotalRaised = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM donations');
    res.json({ total: Number(result.rows[0].total) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total raised' });
  }
};
