// frontend/src/types/index.ts
// ⚠️ CE FICHIER EST DIFFÉRENT DE src/index.tsx !
//
// src/index.tsx = Point d'entrée React (démarre l'application)
// src/types/index.ts = Définitions TypeScript (types partagés)
//
// Les deux fichiers s'appellent "index" mais sont dans des dossiers différents
// et ont des rôles complètement différents !

// ===== TYPES PARTAGÉS POUR TOUTE L'APPLICATION =====

// Type pour un utilisateur
export interface User {
  id: number;
  email: string;
  username: string;
  created_at: Date;
}

// Type pour un serveur distant
export interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  status: 'online' | 'offline' | 'error';
  last_check?: Date;
}

// Type pour un message dans le chat
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    command?: string;
    server?: string;
    execution_time?: number;
  };
}

// Type pour une commande exécutée
export interface Command {
  id: number;
  command: string;
  server_id: number;
  user_id: number;
  result?: string;
  status: 'pending' | 'success' | 'error';
  executed_at: Date;
}

// Type pour une conversation
export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

// Type générique pour les réponses de l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Exemple d'utilisation dans un composant :
// import { User, Server } from '../types';
// const user: User = { id: 1, email: "test@test.com", ... };