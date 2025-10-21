import { Server, Socket } from 'socket.io';
import { authService } from '../auth/AuthService';
import { logger } from '../../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

export const setupWebSocket = (io: Server): void => {
  // Middleware d'authentification WebSocket
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = authService.verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Gestion des connexions
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`WebSocket connected: ${socket.userEmail} (${socket.id})`);
    
    // Joindre une room personnelle
    socket.join(`user:${socket.userId}`);
    
    // Événement: Nouveau message chat
    socket.on('chat:message', async (data) => {
      logger.info(`Chat message from ${socket.userEmail}: ${data.message}`);
      
      // Traiter le message et renvoyer la réponse
      // (La logique de traitement est dans les routes REST)
      
      socket.emit('chat:message:sent', {
        success: true,
        messageId: data.messageId
      });
    });
    
    // Événement: Demande de métriques en temps réel
    socket.on('metrics:subscribe', (serverId: string) => {
      logger.info(`User ${socket.userEmail} subscribed to metrics for server ${serverId}`);
      socket.join(`metrics:${serverId}`);
      
      // Envoyer confirmation
      socket.emit('metrics:subscribed', { serverId });
    });
    
    // Événement: Arrêt de l'abonnement aux métriques
    socket.on('metrics:unsubscribe', (serverId: string) => {
      logger.info(`User ${socket.userEmail} unsubscribed from metrics for server ${serverId}`);
      socket.leave(`metrics:${serverId}`);
      
      socket.emit('metrics:unsubscribed', { serverId });
    });
    
    // Événement: Ping/Pong pour keep-alive
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
    
    // Déconnexion
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket disconnected: ${socket.userEmail} (${reason})`);
    });
    
    // Erreurs
    socket.on('error', (error) => {
      logger.error(`WebSocket error for ${socket.userEmail}:`, error);
    });
  });
  
  logger.info('✅ WebSocket setup complete');
};

// Fonction helper pour émettre à un utilisateur spécifique
export const emitToUser = (io: Server, userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

// Fonction helper pour émettre des métriques à tous les abonnés d'un serveur
export const emitMetrics = (io: Server, serverId: string, metrics: any): void => {
  io.to(`metrics:${serverId}`).emit('metrics:update', {
    serverId,
    metrics,
    timestamp: Date.now()
  });
};

// Fonction helper pour émettre une alerte globale
export const emitAlert = (io: Server, alert: any): void => {
  io.emit('alert', alert);
};