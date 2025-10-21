import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/authentication';
import pool from '../../config/database';

const router = express.Router();

// Types
interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  status: 'online' | 'offline' | 'warning';
  tags?: string[];
  user_id: number;
}

// GET /api/servers - Liste tous les serveurs de l'utilisateur
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        host, 
        port, 
        username, 
        status, 
        tags, 
        created_at, 
        updated_at 
      FROM servers 
      WHERE user_id = $1 
      ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// GET /api/servers/:id - Obtenir un serveur spécifique
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const serverId = parseInt(req.params.id);

    if (isNaN(serverId)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }

    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        host, 
        port, 
        username, 
        status, 
        tags, 
        created_at, 
        updated_at 
      FROM servers 
      WHERE id = $1 AND user_id = $2`,
      [serverId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching server:', error);
    res.status(500).json({ error: 'Failed to fetch server' });
  }
});

// POST /api/servers - Ajouter un nouveau serveur
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, host, port, username, password, tags } = req.body;

    // Validation
    if (!name || !host || !username) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, host, username' 
      });
    }

    // Insérer le serveur
    const result = await pool.query(
      `INSERT INTO servers 
        (name, host, port, username, password, tags, user_id, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, name, host, port, username, status, tags, created_at`,
      [name, host, port || 22, username, password, tags || [], userId, 'online']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// PUT /api/servers/:id - Mettre à jour un serveur
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const serverId = parseInt(req.params.id);
    const { name, host, port, username, password, tags, status } = req.body;

    if (isNaN(serverId)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }

    // Vérifier que le serveur appartient à l'utilisateur
    const checkResult = await pool.query(
      'SELECT id FROM servers WHERE id = $1 AND user_id = $2',
      [serverId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Construire la requête de mise à jour dynamiquement
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (host !== undefined) {
      updates.push(`host = $${paramCount++}`);
      values.push(host);
    }
    if (port !== undefined) {
      updates.push(`port = $${paramCount++}`);
      values.push(port);
    }
    if (username !== undefined) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }
    if (password !== undefined) {
      updates.push(`password = $${paramCount++}`);
      values.push(password);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(tags);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(serverId, userId);

    const result = await pool.query(
      `UPDATE servers 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount++} AND user_id = $${paramCount++} 
      RETURNING id, name, host, port, username, status, tags, updated_at`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating server:', error);
    res.status(500).json({ error: 'Failed to update server' });
  }
});

// DELETE /api/servers/:id - Supprimer un serveur
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const serverId = parseInt(req.params.id);

    if (isNaN(serverId)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }

    const result = await pool.query(
      'DELETE FROM servers WHERE id = $1 AND user_id = $2 RETURNING id',
      [serverId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ message: 'Server deleted successfully', id: serverId });
  } catch (error) {
    console.error('Error deleting server:', error);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

export default router;