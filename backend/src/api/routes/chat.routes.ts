import { Router, Request, Response } from 'express';
import { authService } from '../../services/auth/AuthService';
import { logger } from '../../utils/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

/**
 * POST /api/auth/register
 * Créer un nouveau compte utilisateur
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  
  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password and name are required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
  try {
    const result = await authService.register(email, password, name);
    
    res.status(201).json({
      success: true,
      user: result.user,
      tokens: result.tokens
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const result = await authService.login(email, password);
    
    res.json({
      success: true,
      user: result.user,
      tokens: result.tokens
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    throw error;
  }
}));

/**
 * POST /api/auth/refresh
 * Rafraîchir le access token
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  
  try {
    const accessToken = await authService.refreshAccessToken(refreshToken);
    
    res.json({
      success: true,
      accessToken
    });
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}));

/**
 * POST /api/auth/logout
 * Déconnexion (côté client, invalide les tokens)
 */
router.post('/logout', (req: Request, res: Response) => {
  // En JWT stateless, le logout est géré côté client
  // On peut ajouter une blacklist Redis pour plus de sécurité
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export { router as authRouter };