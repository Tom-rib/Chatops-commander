import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Server, Wifi, WifiOff } from 'lucide-react';

interface SSHConnection {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const SSHTab: React.FC = () => {
  const [connection, setConnection] = useState<SSHConnection>({
    host: '',
    port: 22,
    username: '',
    password: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'En attente de connexion SSH...',
      timestamp: new Date()
    }
  ]);
  const [command, setCommand] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalLines]);

  const handleConnect = async () => {
    if (!connection.host || !connection.username || !connection.password) {
      addTerminalLine('error', 'Veuillez remplir tous les champs');
      return;
    }

    addTerminalLine('output', `Connexion à ${connection.username}@${connection.host}:${connection.port}...`);

    try {
      // TODO: Remplacer par une vraie connexion SSH via WebSocket
      const response = await fetch('/api/ssh/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(connection)
      });

      if (response.ok) {
        setIsConnected(true);
        addTerminalLine('output', '✓ Connexion établie avec succès');
        addTerminalLine('output', `${connection.username}@${connection.host}:~$ `);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      // Mode démo
      setIsConnected(true);
      addTerminalLine('output', '✓ Connexion établie (mode démo)');
      addTerminalLine('output', `${connection.username}@${connection.host}:~$ `);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    addTerminalLine('output', '✓ Déconnexion réussie');
    addTerminalLine('output', 'En attente de connexion SSH...');
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !isConnected) return;

    addTerminalLine('input', `${connection.username}@${connection.host}:~$ ${command}`);

    try {
      // TODO: Remplacer par une vraie exécution de commande SSH
      const response = await fetch('/api/ssh/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ command })
      });

      if (response.ok) {
        const data = await response.json();
        addTerminalLine('output', data.output || 'Commande exécutée');
      } else {
        throw new Error('Command execution failed');
      }
    } catch (error) {
      // Réponses démo
      const demoResponses: { [key: string]: string } = {
        'ls': 'Desktop  Documents  Downloads  Pictures  Videos',
        'pwd': `/home/${connection.username}`,
        'whoami': connection.username,
        'uname -a': 'Linux server 5.15.0-1234-generic #1234 SMP x86_64 GNU/Linux',
        'df -h': 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       100G   45G   50G  47% /',
        'free -h': 'total        used        free      shared\nMem:          16Gi       8.0Gi       4.0Gi       1.0Gi',
      };

      const response = demoResponses[command.trim()] || `bash: ${command}: command not found`;
      addTerminalLine('output', response);
    }

    setCommand('');
  };

  const addTerminalLine = (type: 'input' | 'output' | 'error', content: string) => {
    setTerminalLines(prev => [
      ...prev,
      { type, content, timestamp: new Date() }
    ]);
  };

  const clearTerminal = () => {
    setTerminalLines([
      {
        type: 'output',
        content: isConnected ? `${connection.username}@${connection.host}:~$ ` : 'En attente de connexion SSH...',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-deep-black">
      {/* Header */}
      <div className="bg-slate-gray border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-orange bg-opacity-20 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-warning-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Connexion SSH</h2>
              <p className="text-sm text-text-secondary">
                {isConnected ? `Connecté à ${connection.host}` : 'Non connecté'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-cyber-green" />
                <span className="px-3 py-1 bg-cyber-green bg-opacity-20 text-cyber-green text-xs font-semibold rounded-full">
                  Connecté
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-text-secondary" />
                <span className="px-3 py-1 bg-gray-700 text-text-secondary text-xs font-semibold rounded-full">
                  Déconnecté
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Connection Form */}
        {!isConnected && (
          <div className="w-96 bg-slate-gray border-r border-gray-700 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Paramètres de connexion</h3>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleConnect(); }}>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Hôte</label>
                <input
                  type="text"
                  value={connection.host}
                  onChange={(e) => setConnection({ ...connection, host: e.target.value })}
                  placeholder="192.168.1.100"
                  className="w-full bg-deep-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-warning-orange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Port</label>
                <input
                  type="number"
                  value={connection.port}
                  onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) })}
                  className="w-full bg-deep-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-warning-orange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={connection.username}
                  onChange={(e) => setConnection({ ...connection, username: e.target.value })}
                  placeholder="root"
                  className="w-full bg-deep-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-warning-orange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={connection.password}
                  onChange={(e) => setConnection({ ...connection, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-deep-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-warning-orange focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-warning-orange hover:bg-opacity-80 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Se connecter
              </button>
            </form>

            <div className="mt-6 p-4 bg-deep-black border border-gray-700 rounded-lg">
              <p className="text-xs text-text-secondary">
                <strong className="text-white">Note :</strong> Assurez-vous que le serveur SSH est accessible et que les identifiants sont corrects.
              </p>
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Header */}
          <div className="bg-deep-black border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyber-green" />
              <span className="text-sm font-mono text-white">Terminal SSH</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearTerminal}
                className="px-3 py-1 text-xs bg-slate-gray hover:bg-gray-700 text-white rounded transition-all"
              >
                Effacer
              </button>
              {isConnected && (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1 text-xs bg-error-red hover:bg-opacity-80 text-white rounded transition-all"
                >
                  Déconnecter
                </button>
              )}
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 bg-deep-black p-4 overflow-y-auto font-mono text-sm">
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  line.type === 'input' ? 'text-cyber-cyan' :
                  line.type === 'error' ? 'text-error-red' :
                  'text-cyber-green'
                }`}
              >
                {line.content}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input */}
          {isConnected && (
            <div className="bg-deep-black border-t border-gray-700 p-4">
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
                <span className="text-cyber-green font-mono">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Entrez une commande..."
                  className="flex-1 bg-transparent border-none text-white font-mono placeholder-text-secondary focus:outline-none"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSHTab;