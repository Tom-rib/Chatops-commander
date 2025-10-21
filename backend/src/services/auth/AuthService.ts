import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../types/models';
import { db } from '../../config/database';
import { logger } from '../../utils/logger';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private JWT_SECRET: string;
  private REFRESH_SECRET: string;
  
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
    this.REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
  }
  
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; tokens: TokenPair }> {
    try {
      // Check if user exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user (first user is admin)
      const userCount = await db.query('SELECT COUNT(*) FROM users');
      const isFirstUser = parseInt(userCount.rows[0].count) === 0;
      const role = isFirstUser ? 'admin' : 'operator';
      
      const result = await db.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, created_at`,
        [email, passwordHash, name, role]
      );
      
      const user = result.rows[0];
      const tokens = this.generateTokens(user);
      
      logger.info(`User registered: ${email} (${role})`);
      
      return { user, tokens };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }
  
  async login(email: string, password: string): Promise<{ user: User; tokens: TokenPair }> {
    try {
      // Find user
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const user = result.rows[0];
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      
      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );
      
      // Generate tokens
      const tokens = this.generateTokens(user);
      
      // Remove password hash from response
      delete user.password_hash;
      
      logger.info(`User logged in: ${email}`);
      
      return { user, tokens };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }
  
  generateTokens(user: User): TokenPair {
    // Access token (15 min)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Refresh token (7 days)
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
  
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.REFRESH_SECRET) as { userId: string };
      
      // Get user
      const result = await db.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = result.rows[0];
      
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        this.JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      return accessToken;
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }
  
  verifyAccessToken(token: string): { userId: string; email: string; role: string } {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string; role: string };
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}

export const authService = new AuthService();