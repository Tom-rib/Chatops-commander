import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useChat();
  
  const username = localStorage.getItem('username') || 'Utilisateur';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-xl font-bold text-white">C</span>';
                }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">ChatOps</h2>
              <p className="text-xs text-slate-400">Commander</p>
            </div>
          </div>
          
          <div className="text-sm text-slate-400 p-3 bg-slate-700/50 rounded-lg">
            <p className="font-medium text-cyan-400 mb-1">💡 Astuce</p>
            <p className="text-xs">Demandez des infos sur vos serveurs, déployez du code, ou gérez votre infrastructure</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{username}</p>
                <p className="text-xs text-slate-400">En ligne</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <svg className="w-5 h-5 text-slate-400 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Assistant DevOps</h1>
              <p className="text-sm text-slate-400">Gérez votre infrastructure par chat</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              IA Active
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">👋 Bienvenue !</h2>
                <p className="text-slate-400 mb-6">
                  Posez-moi une question sur votre infrastructure ou utilisez les suggestions ci-dessous
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInput('Liste tous mes serveurs')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-slate-700"
                  >
                    <span className="text-lg mb-1 block">📊</span>
                    <span className="text-sm text-white">Mes serveurs</span>
                  </button>
                  <button
                    onClick={() => setInput('Vérifie le status de tous les services')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-slate-700"
                  >
                    <span className="text-lg mb-1 block">✅</span>
                    <span className="text-sm text-white">Status services</span>
                  </button>
                  <button
                    onClick={() => setInput('Montre-moi les métriques CPU')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-slate-700"
                  >
                    <span className="text-lg mb-1 block">📈</span>
                    <span className="text-sm text-white">Métriques</span>
                  </button>
                  <button
                    onClick={() => setInput('Aide-moi à déployer')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-slate-700"
                  >
                    <span className="text-lg mb-1 block">🚀</span>
                    <span className="text-sm text-white">Déployer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <span className="text-white font-bold text-sm">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-slate-800 text-slate-100 border border-slate-700'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tapez votre message... (Ex: Liste mes serveurs)"
                disabled={loading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Envoyer</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                )}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInput('Liste tous mes serveurs')}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                📊 Mes serveurs
              </button>
              <button
                type="button"
                onClick={() => setInput('Vérifie le status de mes services')}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                ✅ Status services
              </button>
              <button
                type="button"
                onClick={() => setInput('Montre-moi les logs du dernier déploiement')}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                📋 Logs
              </button>
              <button
                type="button"
                onClick={() => setInput('Redémarre les services en erreur')}
                className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                🔄 Redémarrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;