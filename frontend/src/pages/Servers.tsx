import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Server {
  id: number;
  name: string;
  host: string;
  status: 'online' | 'offline' | 'warning';
  tags?: string[];
}

const Servers: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/servers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des serveurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-cyber-green';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'offline': return 'Hors ligne';
      case 'warning': return 'Avertissement';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-cyan text-xl">Chargement des serveurs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Serveurs</h1>
          <p className="text-gray-400">Gérez votre infrastructure</p>
        </div>
        <Button variant="primary">
          + Ajouter un serveur
        </Button>
      </div>

      {/* Servers Grid */}
      {servers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖥️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun serveur</h3>
            <p className="text-gray-400 mb-4">Commencez par ajouter votre premier serveur</p>
            <Button variant="primary">Ajouter un serveur</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.id} hover className="animate-slide-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{server.name}</h3>
                  <p className="text-sm text-gray-400 font-mono">{server.host}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(server.status)} text-white`}>
                  {getStatusLabel(server.status)}
                </span>
                {server.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs rounded bg-slate-gray text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  Détails
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  SSH
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Servers;