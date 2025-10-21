import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    await sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-gray rounded-lg border border-gray-700">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-xl mb-2">👋 Bonjour !</p>
            <p>Posez-moi une question sur votre infrastructure</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-cyber-cyan text-deep-black'
                    : 'bg-dark-blue text-white border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-blue border border-gray-700 rounded-lg p-3">
              <div className="flex gap-1">
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
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;