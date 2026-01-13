import { NextFunction, Request, Response } from 'express';

// Extend Request interface để include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware - Kiểm tra token và role
 * @param requiredRole - Role cần thiết để access endpoint ('admin', 'user', hoặc undefined cho public)
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it';

export const authenticateToken = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      if (requiredRole) {
        return res.status(401).json({ error: 'Access token required' });
      }
      return next(); // Public endpoint - but user will be undefined
    }

    try {
      // Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      req.user = {
        username: decoded.username,
        role: decoded.role
      };

      // Check role requirement
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      if (requiredRole) {
          return res.status(401).json({ error: 'Invalid or expired token' });
      }
      next();
    }
  };
};

/**
 * Admin-only middleware shorthand
 */
export const requireAdmin = authenticateToken('admin');

/**
 * Authenticated user middleware (any role)
 */
export const requireAuth = authenticateToken();