import express, { Request, Response } from 'express';
import { AuthService } from '../../services/auth/AuthService';
import { authenticate } from '../../middleware/authentication';

const router = express.Router();
const authService = new AuthService();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await authService.register({ username, email, password, role });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Login failed' });
  }
});

router.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await authService.logout(userId);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.get('/me', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const user = (res.locals as any).user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;