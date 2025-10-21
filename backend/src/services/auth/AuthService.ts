import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/database';

export class AuthService {
  async register(data: { username: string; email: string; password: string; role?: string }) {
    const { username, email, password, role = 'operator' } = data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return { token, user };
  }

  async login(email: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  }

  async logout(_userId: number) {
    // Implement logout logic (invalidate token in Redis, etc.)
    return { message: 'Logged out successfully' };
  }
}