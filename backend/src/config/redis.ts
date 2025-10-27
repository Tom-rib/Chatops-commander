import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du client Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Trop de tentatives de reconnexion Redis');
        return new Error('Trop de tentatives de reconnexion');
      }
      return retries * 100;
    }
  }
});

// Gestion des événements Redis
redisClient.on('connect', () => {
  console.log('✅ Connexion à Redis établie');
});

redisClient.on('error', (err) => {
  console.error('❌ Erreur Redis:', err);
});

redisClient.on('ready', () => {
  console.log('✅ Redis prêt à recevoir des commandes');
});

// Connexion à Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Erreur de connexion à Redis:', error);
    throw error;
  }
};

// Fonctions utilitaires pour Redis
export const redisUtils = {
  // Stocker une session utilisateur
  setSession: async (userId: string, sessionData: any, expiresIn: number = 7 * 24 * 60 * 60) => {
    const key = `session:${userId}`;
    await redisClient.setEx(key, expiresIn, JSON.stringify(sessionData));
  },

  // Récupérer une session
  getSession: async (userId: string) => {
    const key = `session:${userId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Supprimer une session
  deleteSession: async (userId: string) => {
    const key = `session:${userId}`;
    await redisClient.del(key);
  },

  // Stocker un message en cache
  cacheMessage: async (messageId: string, message: any, ttl: number = 3600) => {
    const key = `message:${messageId}`;
    await redisClient.setEx(key, ttl, JSON.stringify(message));
  },

  // Récupérer un message du cache
  getCachedMessage: async (messageId: string) => {
    const key = `message:${messageId}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }
};

export default redisClient;
