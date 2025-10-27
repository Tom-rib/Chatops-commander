import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @route   POST /api/chat/conversations
 * @desc    Créer une nouvelle conversation
 * @access  Private
 */
router.post('/conversations', ChatController.createConversation);

/**
 * @route   GET /api/chat/conversations
 * @desc    Obtenir toutes les conversations de l'utilisateur
 * @access  Private
 */
router.get('/conversations', ChatController.getConversations);

/**
 * @route   GET /api/chat/conversations/:id
 * @desc    Obtenir une conversation spécifique avec ses messages
 * @access  Private
 */
router.get('/conversations/:id', ChatController.getConversation);

/**
 * @route   PUT /api/chat/conversations/:id
 * @desc    Mettre à jour le titre d'une conversation
 * @access  Private
 */
router.put('/conversations/:id', ChatController.updateConversationTitle);

/**
 * @route   DELETE /api/chat/conversations/:id
 * @desc    Supprimer une conversation
 * @access  Private
 */
router.delete('/conversations/:id', ChatController.deleteConversation);

/**
 * @route   POST /api/chat/conversations/:id/messages
 * @desc    Envoyer un message et obtenir une réponse de Claude
 * @access  Private
 */
router.post('/conversations/:id/messages', ChatController.sendMessage);

/**
 * @route   POST /api/chat/analyze-command
 * @desc    Analyser une commande système avec Claude
 * @access  Private
 */
router.post('/analyze-command', ChatController.analyzeCommand);

export default router;
