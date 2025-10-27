import { query } from '../config/database';

export interface Message {
  id: number;
  conversation_id: number;
  user_id: number | null;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: any;
  created_at: Date;
}

export interface CreateMessageInput {
  conversation_id: number;
  user_id?: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: any;
}

export class MessageModel {
  // Créer un nouveau message
  static async create(data: CreateMessageInput): Promise<Message> {
    const { conversation_id, user_id, content, role, metadata } = data;
    
    const result = await query(
      `INSERT INTO messages (conversation_id, user_id, content, role, metadata) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [conversation_id, user_id || null, content, role, metadata ? JSON.stringify(metadata) : null]
    );
    
    return result.rows[0];
  }

  // Trouver un message par ID
  static async findById(id: number): Promise<Message | null> {
    const result = await query(
      'SELECT * FROM messages WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  // Trouver tous les messages d'une conversation
  static async findByConversationId(conversationId: number, limit: number = 100): Promise<Message[]> {
    const result = await query(
      `SELECT m.*, u.username, u.avatar_url
       FROM messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2`,
      [conversationId, limit]
    );
    
    return result.rows;
  }

  // Obtenir l'historique de conversation pour l'IA
  static async getConversationHistory(conversationId: number, limit: number = 20): Promise<{role: string, content: string}[]> {
    const result = await query(
      `SELECT role, content 
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [conversationId, limit]
    );
    
    // Inverser l'ordre pour avoir le plus ancien en premier
    return result.rows.reverse();
  }

  // Compter les messages d'une conversation
  static async countByConversationId(conversationId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM messages WHERE conversation_id = $1',
      [conversationId]
    );
    
    return parseInt(result.rows[0].count);
  }

  // Supprimer tous les messages d'une conversation
  static async deleteByConversationId(conversationId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM messages WHERE conversation_id = $1',
      [conversationId]
    );
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Mettre à jour un message
  static async update(id: number, content: string, metadata?: any): Promise<Message | null> {
    const result = await query(
      `UPDATE messages 
       SET content = $1, metadata = $2
       WHERE id = $3 
       RETURNING *`,
      [content, metadata ? JSON.stringify(metadata) : null, id]
    );
    
    return result.rows[0] || null;
  }

  // Supprimer un message
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM messages WHERE id = $1',
      [id]
    );
    
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
