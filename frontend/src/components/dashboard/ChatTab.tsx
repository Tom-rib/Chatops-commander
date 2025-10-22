import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant ChatOps Commander. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // TODO: Remplacer par un vrai appel API vers Claude
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: input })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      // Fallback response pour le démo
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `J'ai bien reçu votre message : "${input}". Pour le moment, je suis en mode démo. Veuillez connecter l'API Claude pour activer les vraies réponses.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-deep-black">
      {/* Header */}
      <div className="bg-slate-gray border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Assistant IA</h2>
            <p className="text-sm text-text-secondary">Propulsé par Claude Sonnet</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyber-green bg-opacity-20 text-cyber-green text-xs font-semibold rounded-full">
              En ligne
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-fade-in ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-cyber-cyan flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-deep-black" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-cyber-cyan text-deep-black'
                  : 'bg-slate-gray text-white border border-gray-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span
                className={`text-xs mt-2 block ${
                  message.role === 'user' ? 'text-deep-black opacity-70' : 'text-text-secondary'
                }`}
              >
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-cyber-green flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-deep-black" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-cyber-cyan flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-deep-black" />
            </div>
            <div className="bg-slate-gray text-white border border-gray-700 rounded-2xl px-6 py-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-gray border-t border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={loading}
            className="flex-1 bg-deep-black border border-gray-700 rounded-lg px-6 py-4 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyber-cyan hover:bg-opacity-80 text-deep-black font-semibold px-8 py-4 rounded-lg transition-all glow-cyan disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Envoyer</span>
          </button>
        </form>
        <p className="text-xs text-text-secondary mt-3 text-center">
          L'IA peut faire des erreurs. Vérifiez les informations importantes.
        </p>
      </div>
    </div>
  );
};

export default ChatTab;