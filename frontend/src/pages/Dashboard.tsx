import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';

interface ServerStats {
  total: number;
  online: number;
  offline: number;
  warning: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ServerStats>({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/servers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const servers = response.data;
      setStats({
        total: servers.length,
        online: servers.filter((s: any) => s.status === 'online').length,
        offline: servers.filter((s: any) => s.status === 'offline').length,
        warning: servers.filter((s: any) => s.status === 'warning').length,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Serveurs', value: stats.total, icon: '🖥️', color: 'cyber-cyan' },
    { label: 'En ligne', value: stats.online, icon: '✅', color: 'cyber-green' },
    { label: 'Hors ligne', value: stats.offline, icon: '❌', color: 'red-500' },
    { label: 'Avertissements', value: stats.warning, icon: '⚠️', color: 'yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-cyan text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Vue d'ensemble de votre infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-dark-blue hover:bg-slate-gray border border-gray-700 hover:border-cyber-cyan rounded-lg transition-all text-left">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="text-white font-semibold mb-1">Ouvrir le Chat</h3>
            <p className="text-gray-400 text-sm">Parlez à votre infrastructure</p>
          </button>
          
          <button className="p-4 bg-dark-blue hover:bg-slate-gray border border-gray-700 hover:border-cyber-cyan rounded-lg transition-all text-left">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-white font-semibold mb-1">Voir les Métriques</h3>
            <p className="text-gray-400 text-sm">Analyser les performances</p>
          </button>
          
          <button className="p-4 bg-dark-blue hover:bg-slate-gray border border-gray-700 hover:border-cyber-cyan rounded-lg transition-all text-left">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="text-white font-semibold mb-1">Gérer les Serveurs</h3>
            <p className="text-gray-400 text-sm">Configuration et statut</p>
          </button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Activité Récente</h2>
        <div className="space-y-3">
          {[
            { time: 'Il y a 5 min', action: 'nginx redémarré sur web-01', status: 'success' },
            { time: 'Il y a 12 min', action: 'Status vérifié sur db-master', status: 'info' },
            { time: 'Il y a 1h', action: 'Alerte CPU élevé sur web-02', status: 'warning' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-blue rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-cyber-green' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-cyber-cyan'
                }`} />
                <span className="text-gray-300">{activity.action}</span>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;