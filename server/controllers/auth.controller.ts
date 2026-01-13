import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, 'user']
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { username: newUser.rows[0].username, role: newUser.rows[0].role } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    // Admin Backdoor (Keep for compatibility if DB empty, but prefer DB)
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (isValid) {
      const token = jwt.sign(
        { username: user.username, role: user.role, id: user.id }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      res.json({ token, user: { username: user.username, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if user still exists (optional but recommended)
    // For "admin" backdoor:
    if (decoded.username === 'admin') {
       return res.json({ valid: true, user: { username: 'admin', role: 'admin' } });
    }

    // For DB users
    /* 
    // Optimization: Trust the token until it expires to save DB calls, or verify existence:
    const result = await pool.query('SELECT username, role FROM users WHERE username = $1', [decoded.username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'User not found' });
    */

    res.json({ 
      valid: true, 
      user: { username: decoded.username, role: decoded.role } 
    });

  } catch (error) {
    // console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
