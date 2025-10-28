import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'aisystant_db',
  user: process.env.DB_USER || 'aisystant',
  password: process.env.DB_PASSWORD || 'aisystant_password',
  max: 20, // Maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à PostgreSQL établie');
});
pool.on('error', (err: Error) => {
  console.error('❌ Erreur PostgreSQL:', err);
  process.exit(-1);
});

// Fonction pour exécuter des requêtes
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Requête exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    throw error;
  }
};

// Fonction pour obtenir un client du pool
export const getClient = () => pool.connect();

export default pool;
