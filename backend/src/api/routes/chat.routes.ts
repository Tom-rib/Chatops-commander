import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/authentication';
import { AIEngine } from '../../services/ai/AIEngine';

const router = express.Router();
const aiEngine = new AIEngine();

router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const response = await aiEngine.parse(message, conversationId);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.get('/history', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ conversations: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;