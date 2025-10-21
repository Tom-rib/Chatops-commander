import { useState } from 'react';
import api from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post('/api/chat', { message: content });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response || 'Pas de réponse',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erreur lors de l\'envoi du message',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
};