import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export class StatsController {
  static async getUserStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      // Compter les conversations
      const conversationsResult = await query(
        'SELECT COUNT(*) as count FROM conversations WHERE user_id = $1',
        [userId]
      );
      const conversationsCount = parseInt(conversationsResult.rows[0].count);

      // Compter les messages
      const messagesResult = await query(
        'SELECT COUNT(*) as count FROM messages WHERE user_id = $1',
        [userId]
      );
      const messagesCount = parseInt(messagesResult.rows[0].count);

      // Compter les serveurs SSH
      const serversResult = await query(
        'SELECT COUNT(*) as count FROM ssh_servers WHERE user_id = $1',
        [userId]
      );
      const serversCount = parseInt(serversResult.rows[0].count);

      // Compter les connexions actives (pour l'instant 0, car pas encore implémenté)
      const activeConnectionsCount = 0;

      return res.json({
        success: true,
        data: {
          conversations: conversationsCount,
          messages: messagesCount,
          servers: serversCount,
          activeConnections: activeConnectionsCount
        }
      });

    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }
}