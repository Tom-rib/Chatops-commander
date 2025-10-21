import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const result = await pool.query(
      'SELECT id, username, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    (req as any).user = result.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};