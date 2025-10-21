import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth/AuthService';
import { logger } from '../utils/logger';

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header' });
      return;
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid authorization format' });
      return;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = authService.verifyAccessToken(token);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware de vérification de rôle
 * Vérifie que l'utilisateur a le rôle minimum requis
 */
export const requireRole = (minRole: 'viewer' | 'operator' | 'admin') => {
  const roleHierarchy = {
    viewer: 0,
    operator: 1,
    admin: 2
  };
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const userRoleLevel = roleHierarchy[req.user.role as keyof typeof roleHierarchy];
    const requiredRoleLevel = roleHierarchy[minRole];
    
    if (userRoleLevel >= requiredRoleLevel) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

/**
 * Middleware optionnel - n'échoue pas si pas de token
 * Utile pour les endpoints qui ont un comportement différent selon l'auth
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyAccessToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Ignore errors, just continue without user
    next();
  }
};