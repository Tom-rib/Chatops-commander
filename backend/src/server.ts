import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';

// Configuration
dotenv.config();

// Import des routes
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import sshRoutes from './routes/ssh';

// Import des configurations
import pool from './config/database';
import { connectRedis } from './config/redis';

// Import des middlewares
import { authenticate } from './middleware/auth';

// Configuration de l'application
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Configuration de Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: parseInt(process.env.WS_PING_INTERVAL || '30000'),
  pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '5000')
});

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour le développement
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ChatOps Commander API v1.0.0',
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Test de connexion à PostgreSQL
    await pool.query('SELECT 1');
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'running'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Service indisponible'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ssh', sshRoutes);

// Gestion des routes non trouvées
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestion des erreurs globale
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur globale:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configuration de Socket.IO pour le chat en temps réel
io.on('connection', (socket) => {
  console.log(`✅ Nouveau client WebSocket connecté: ${socket.id}`);

  // Joindre une room de conversation
  socket.on('join_conversation', (conversationId: number) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Client ${socket.id} a rejoint la conversation ${conversationId}`);
  });

  // Quitter une room de conversation
  socket.on('leave_conversation', (conversationId: number) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`Client ${socket.id} a quitté la conversation ${conversationId}`);
  });

  // Nouveau message (diffusé à tous les clients de la conversation)
  socket.on('new_message', (data: { conversationId: number; message: any }) => {
    io.to(`conversation_${data.conversationId}`).emit('message_received', data.message);
  });

  // Typing indicator
  socket.on('typing', (data: { conversationId: number; username: string }) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', data);
  });

  socket.on('stop_typing', (data: { conversationId: number }) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_stop_typing', data);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`❌ Client WebSocket déconnecté: ${socket.id}`);
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à Redis
    await connectRedis();
    console.log('✅ Redis connecté');

    // Test de connexion à PostgreSQL
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connecté');

    // Démarrage du serveur HTTP
    httpServer.listen(PORT, HOST, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 ChatOps Commander Backend démarré !');
      console.log(`📡 API: http://${HOST}:${PORT}`);
      console.log(`🔌 WebSocket: ws://${HOST}:${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  httpServer.close(() => {
    console.log('Serveur arrêté');
    pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, arrêt du serveur...');
  httpServer.close(() => {
    console.log('Serveur arrêté');
    pool.end();
    process.exit(0);
  });
});

// Démarrer le serveur
startServer();

export { app, io };
