import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @route   GET /api/stats
 * @desc    Obtenir les statistiques de l'utilisateur
 * @access  Private
 */
router.get('/', StatsController.getUserStats);

export default router;