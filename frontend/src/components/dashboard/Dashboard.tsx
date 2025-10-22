import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MessageSquare, Terminal, History, Settings } from 'lucide-react';
import ChatTab from './ChatTab';
import SSHTab from './SSHTab';

type TabType = 'chat' | 'ssh' | 'history' | 'settings';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"Utilisateur"}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'chat' as TabType, label: 'Chat Assistant', icon: MessageSquare },
    { id: 'ssh' as TabType, label: 'Connexion SSH', icon: Terminal },
    { id: 'history' as TabType, label: 'Historique', icon: History },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-deep-black">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-gray border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <img src="/apple-touch-icon.png" alt="ChatOps Commander" className="h-8 w-8 rounded mr-3" />
          <div>
            <h1 className="text-white font-bold text-lg">ChatOps</h1>
            <p className="text-xs text-text-secondary">Commander</p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyber-cyan rounded-full flex items-center justify-center text-deep-black font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm">{user.username}</h3>
              <span className="text-xs text-cyber-green flex items-center gap-1">
                <span className="w-2 h-2 bg-cyber-green rounded-full"></span>
                En ligne
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyber-cyan text-deep-black font-semibold'
                    : 'text-text-secondary hover:bg-deep-black hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error-red hover:bg-deep-black transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'ssh' && <SSHTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

// History Tab (simple placeholder)
const HistoryTab: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <History className="w-16 h-16 text-text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Historique</h2>
        <p className="text-text-secondary">Vos conversations précédentes apparaîtront ici</p>
      </div>
    </div>
  );
};

// Settings Tab (simple placeholder)
const SettingsTab: React.FC = () => {
  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">Paramètres</h2>
        
        <div className="space-y-6">
          <div className="bg-slate-gray p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-deep-black border border-gray-700 rounded-lg text-white"
                  placeholder="user@exemple.com"
                />
              </div>
              <button className="bg-cyber-cyan text-deep-black font-semibold px-6 py-2 rounded-lg hover:bg-opacity-80 transition-all">
                Modifier le profil
              </button>
            </div>
          </div>

          <div className="bg-slate-gray p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Préférences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-white">Activer les notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-white">Mode sombre</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;