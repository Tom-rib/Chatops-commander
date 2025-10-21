import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../../middleware/authentication';
import { db } from '../../config/database';
import { sshClient } from '../../services/execution/SSHClient';
import { logger } from '../../utils/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// Tous les endpoints nécessitent l'authentification
router.use(authenticate);

/**
 * GET /api/servers
 * Liste tous les serveurs
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const result = await db.query(
    `INSERT INTO servers (name, hostname, ip_address, port, ssh_user, ssh_key_path, tags, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, hostname, ip_address, port, ssh_user, tags, status, created_at`,
    [name, hostname, ipAddress, port, sshUser, sshKeyPath, JSON.stringify(tags), userId]
  );
  
  logger.info(`Server created: ${name} by ${req.user!.email}`);
  
  res.status(201).json({
    success: true,
    data: result.rows[0]
  });
}));

/**
 * PUT /api/servers/:id
 * Mettre à jour un serveur (admin uniquement)
 */
router.put('/:id', requireRole('admin'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, hostname, ipAddress, port, sshUser, sshKeyPath, tags } = req.body;
  
  const result = await db.query(
    `UPDATE servers 
     SET name = COALESCE($1, name),
         hostname = COALESCE($2, hostname),
         ip_address = COALESCE($3, ip_address),
         port = COALESCE($4, port),
         ssh_user = COALESCE($5, ssh_user),
         ssh_key_path = COALESCE($6, ssh_key_path),
         tags = COALESCE($7, tags)
     WHERE id = $8
     RETURNING id, name, hostname, ip_address, port, ssh_user, tags, status`,
    [name, hostname, ipAddress, port, sshUser, sshKeyPath, tags ? JSON.stringify(tags) : null, id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  logger.info(`Server updated: ${id} by ${req.user!.email}`);
  
  res.json({
    success: true,
    data: result.rows[0]
  });
}));

/**
 * DELETE /api/servers/:id
 * Supprimer un serveur (admin uniquement)
 */
router.delete('/:id', requireRole('admin'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await db.query('DELETE FROM servers WHERE id = $1 RETURNING name', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  // Disconnect SSH if connected
  await sshClient.disconnect(id);
  
  logger.info(`Server deleted: ${result.rows[0].name} by ${req.user!.email}`);
  
  res.json({
    success: true,
    message: 'Server deleted successfully'
  });
}));

/**
 * POST /api/servers/:id/test
 * Tester la connexion SSH à un serveur
 */
router.post('/:id/test', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const serverResult = await db.query('SELECT * FROM servers WHERE id = $1', [id]);
  
  if (serverResult.rows.length === 0) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const server = serverResult.rows[0];
  
  try {
    await sshClient.connect(server);
    const result = await sshClient.executeCommand(id, 'echo "Connection test"');
    
    // Update server status
    await db.query(
      'UPDATE servers SET status = $1, last_check = NOW() WHERE id = $2',
      ['online', id]
    );
    
    res.json({
      success: true,
      message: 'Connection successful',
      output: result.output
    });
  } catch (error: any) {
    await db.query(
      'UPDATE servers SET status = $1, last_check = NOW() WHERE id = $2',
      ['error', id]
    );
    
    res.status(500).json({
      success: false,
      error: 'Connection failed',
      details: error.message
    });
  }
}));

/**
 * GET /api/servers/:id/metrics
 * Obtenir les métriques d'un serveur
 */
router.get('/:id/metrics', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const serverResult = await db.query('SELECT * FROM servers WHERE id = $1', [id]);
  
  if (serverResult.rows.length === 0) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const server = serverResult.rows[0];
  
  try {
    await sshClient.connect(server);
    
    // Execute multiple commands to get metrics
    const cpuResult = await sshClient.executeCommand(
      id, 
      "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    );
    
    const memResult = await sshClient.executeCommand(
      id,
      "free | grep Mem | awk '{print ($3/$2) * 100.0}'"
    );
    
    const diskResult = await sshClient.executeCommand(
      id,
      "df -h / | tail -1 | awk '{print $5}' | sed 's/%//'"
    );
    
    res.json({
      success: true,
      data: {
        cpu: parseFloat(cpuResult.output.trim()) || 0,
        memory: parseFloat(memResult.output.trim()) || 0,
        disk: parseFloat(diskResult.output.trim()) || 0,
        timestamp: new Date()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
      details: error.message
    });
  }
}));

export { router as serversRouter };'SELECT id, name, hostname, ip_address, port, ssh_user, tags, status, last_check, created_at FROM servers ORDER BY name'
  );
  
  res.json({
    success: true,
    data: result.rows
  });
}));

/**
 * GET /api/servers/:id
 * Détails d'un serveur
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await db.query(
    'SELECT id, name, hostname, ip_address, port, ssh_user, tags, status, last_check, created_at FROM servers WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  res.json({
    success: true,
    data: result.rows[0]
  });
}));

/**
 * POST /api/servers
 * Créer un nouveau serveur (admin uniquement)
 */
router.post('/', requireRole('admin'), asyncHandler(async (req: Request, res: Response) => {
  const { name, hostname, ipAddress, port = 22, sshUser, sshKeyPath, tags = [] } = req.body;
  
  // Validation
  if (!name || !hostname || !ipAddress || !sshUser) {
    return res.status(400).json({ 
      error: 'Name, hostname, IP address and SSH user are required' 
    });
  }
  
  const userId = req.user!.userId;
  
  const result = await db.query(