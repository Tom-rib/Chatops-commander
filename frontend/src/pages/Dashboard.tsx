// frontend/src/pages/Dashboard.tsx - VERSION CORRIGÉE
import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Server, Activity, AlertCircle, Clock } from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalServers: 0,
    activeServers: 0,
    pendingCommands: 0,
    lastActivity: 'Never',
  });

  useEffect(() => {
    // Simuler le chargement des statistiques
    // TODO: Remplacer par de vraies données de l'API
    setStats({
      totalServers: 5,
      activeServers: 3,
      pendingCommands: 2,
      lastActivity: '2 minutes ago',
    });
  }, []);

  const statCards: StatCard[] = [
    {
      label: 'Total Servers',
      value: stats.totalServers,
      icon: <Server className="w-8 h-8" />,
      color: 'text-blue-500',
    },
    {
      label: 'Active Servers',
      value: stats.activeServers,
      icon: <Activity className="w-8 h-8" />,
      color: 'text-green-500',
    },
    {
      label: 'Pending Commands',
      value: stats.pendingCommands,
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'text-yellow-500',
    },
    {
      label: 'Last Activity',
      value: stats.lastActivity,
      icon: <Clock className="w-8 h-8" />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Vue d'ensemble de votre infrastructure
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#1E2538] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-white font-medium">Command executed</p>
                  <p className="text-gray-400 text-sm">
                    systemctl status nginx on web-01
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {index + 1} min ago
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium">
            Add Server
          </button>
          <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white font-medium">
            Run Command
          </button>
          <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium">
            View Logs
          </button>
        </div>
      </Card>

      {/* Server Status */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Server Status</h2>
        <div className="space-y-3">
          {['web-01', 'web-02', 'db-master'].map((server, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#1E2538] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">{server}</p>
                  <p className="text-gray-400 text-sm">
                    192.168.1.{10 + index}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white text-sm">CPU: {20 + index * 10}%</p>
                  <p className="text-gray-400 text-xs">RAM: {40 + index * 5}%</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;