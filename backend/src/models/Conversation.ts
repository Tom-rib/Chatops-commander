import { query } from '../config/database';

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateConversationInput {
  user_id: number;
  title?: string;
}

export class ConversationModel {
  // Créer une nouvelle conversation
  static async create(data: CreateConversationInput): Promise<Conversation> {
    const { user_id, title } = data;
    
    const result = await query(
      `INSERT INTO conversations (user_id, title) 
       VALUES ($1, $2) 
       RETURNING *`,
      [user_id, title || 'Nouvelle conversation']
    );
    
    return result.rows[0];
  }

  // Trouver une conversation par ID
  static async findById(id: number): Promise<Conversation | null> {
    const result = await query(
      'SELECT * FROM conversations WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  // Trouver toutes les conversations d'un utilisateur
  static async findByUserId(userId: number): Promise<Conversation[]> {
    const result = await query(
      `SELECT c.*, 
              COUNT(m.id) as message_count,
              MAX(m.created_at) as last_message_at
       FROM conversations c
       LEFT JOIN messages m ON m.conversation_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY last_message_at DESC NULLS LAST, c.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }

  // Mettre à jour le titre d'une conversation
  static async updateTitle(id: number, title: string): Promise<Conversation | null> {
    const result = await query(
      `UPDATE conversations 
       SET title = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [title, id]
    );
    
    return result.rows[0] || null;
  }

  // Supprimer une conversation
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM conversations WHERE id = $1',
      [id]
    );
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Vérifier si l'utilisateur possède cette conversation
  static async belongsToUser(conversationId: number, userId: number): Promise<boolean> {
    const result = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, userId]
    );
    
    return result.rows.length > 0;
  }
}
