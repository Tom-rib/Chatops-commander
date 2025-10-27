import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Server, 
  Trash2, 
  Terminal as TerminalIcon,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react'
import { sshAPI } from '../services/api'
import { socketService } from '../services/socket'

interface SSHServer {
  id: string
  name: string
  host: string
  port: number
  username: string
  status: 'connected' | 'disconnected' | 'connecting'
}

interface TerminalLine {
  id: string
  content: string
  type: 'command' | 'output' | 'error'
  timestamp: Date
}

export default function SSH() {
  const [servers, setServers] = useState<SSHServer[]>([])
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [isAddingServer, setIsAddingServer] = useState(false)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [command, setCommand] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Formulaire nouveau serveur
  const [newServer, setNewServer] = useState({
    name: '',
    host: '',
    port: 22,
    username: '',
    password: '',
  })

  useEffect(() => {
    loadServers()
    
    // Connecter WebSocket pour les sorties SSH
    const token = localStorage.getItem('token')
    if (token) {
      socketService.connect(token)
      
      socketService.onSSHOutput((data) => {
        addTerminalLine(data.output, 'output')
      })
      
      socketService.onSSHError((data) => {
        addTerminalLine(data.error, 'error')
      })
      
      socketService.onSSHConnected((data) => {
        updateServerStatus(data.serverId, 'connected')
        addTerminalLine(`✓ Connecté au serveur ${data.serverId}`, 'output')
      })
      
      socketService.onSSHDisconnected((data) => {
        updateServerStatus(data.serverId, 'disconnected')
        addTerminalLine(`✗ Déconnecté du serveur ${data.serverId}`, 'error')
      })
    }

    return () => {
      socketService.disconnect()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [terminalLines])

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadServers = async () => {
    try {
      const response = await sshAPI.getServers()
      setServers(response.data.servers || [])
    } catch (error) {
      console.error('Erreur lors du chargement des serveurs:', error)
    }
  }

  const addServer = async () => {
    try {
      const response = await sshAPI.addServer(newServer)
      setServers(prev => [...prev, response.data.server])
      setIsAddingServer(false)
      setNewServer({ name: '', host: '', port: 22, username: '', password: '' })
    } catch (error) {
      console.error('Erreur lors de l\'ajout du serveur:', error)
    }
  }

  const deleteServer = async (serverId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce serveur ?')) return

    try {
      await sshAPI.deleteServer(serverId)
      setServers(prev => prev.filter(s => s.id !== serverId))
      if (selectedServer === serverId) {
        setSelectedServer(null)
        setTerminalLines([])
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const connectToServer = async (serverId: string) => {
    try {
      updateServerStatus(serverId, 'connecting')
      await sshAPI.connect(serverId)
      setSelectedServer(serverId)
      setTerminalLines([])
      addTerminalLine(`Connexion au serveur...`, 'output')
    } catch (error: any) {
      updateServerStatus(serverId, 'disconnected')
      addTerminalLine(`Erreur de connexion: ${error.message}`, 'error')
    }
  }

  const executeCommand = async () => {
    if (!command.trim() || !selectedServer || isExecuting) return

    addTerminalLine(command, 'command')
    setIsExecuting(true)

    try {
      socketService.executeSSHCommand(selectedServer, command)
      setCommand('')
    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error)
      addTerminalLine('Erreur lors de l\'exécution de la commande', 'error')
    } finally {
      setIsExecuting(false)
    }
  }

  const addTerminalLine = (content: string, type: 'command' | 'output' | 'error') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    }
    setTerminalLines(prev => [...prev, newLine])
  }

  const updateServerStatus = (serverId: string, status: SSHServer['status']) => {
    setServers(prev =>
      prev.map(s => (s.id === serverId ? { ...s, status } : s))
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand()
    }
  }

  const selectedServerData = servers.find(s => s.id === selectedServer)

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar - Liste des serveurs */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setIsAddingServer(true)}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un serveur</span>
            </button>
          </div>

          {/* Liste des serveurs */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {servers.length === 0 ? (
              <div className="p-8 text-center">
                <Server className="w-12 h-12 text-text-light mx-auto mb-4" />
                <p className="text-text-light">Aucun serveur</p>
                <p className="text-sm text-text-lighter mt-2">
                  Ajoutez votre premier serveur SSH
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className={`group p-4 rounded-lg cursor-pointer transition-all ${
                      selectedServer === server.id
                        ? 'bg-primary-50 border-2 border-primary'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      if (server.status === 'disconnected') {
                        connectToServer(server.id)
                      } else {
                        setSelectedServer(server.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {server.name}
                        </p>
                        <p className="text-xs text-text-light truncate">
                          {server.username}@{server.host}:{server.port}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteServer(server.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {server.status === 'connected' && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Connecté</span>
                        </>
                      )}
                      {server.status === 'connecting' && (
                        <>
                          <Loader className="w-3 h-3 text-yellow-600 animate-spin" />
                          <span className="text-xs text-yellow-600 font-medium">Connexion...</span>
                        </>
                      )}
                      {server.status === 'disconnected' && (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600 font-medium">Déconnecté</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 flex flex-col">
          {selectedServer ? (
            <>
              {/* Header du terminal */}
              <div className="bg-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TerminalIcon className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">
                      {selectedServerData?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedServerData?.username}@{selectedServerData?.host}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedServerData?.status === 'connected' ? (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-900 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Connecté</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-900 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Connexion...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sortie du terminal */}
              <div className="flex-1 terminal overflow-y-auto">
                {terminalLines.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <TerminalIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-green-400">Terminal prêt</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Tapez une commande pour commencer
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {terminalLines.map((line) => (
                      <div key={line.id} className="terminal-line">
                        {line.type === 'command' && (
                          <span className="text-blue-400">$ {line.content}</span>
                        )}
                        {line.type === 'output' && (
                          <span className="text-green-400">{line.content}</span>
                        )}
                        {line.type === 'error' && (
                          <span className="text-red-400">{line.content}</span>
                        )}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </>
                )}
              </div>

              {/* Zone de saisie de commande */}
              <div className="bg-gray-900 p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 font-mono">$</span>
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez une commande SSH..."
                    className="flex-1 bg-transparent text-green-400 font-mono outline-none placeholder-gray-600"
                    disabled={isExecuting || selectedServerData?.status !== 'connected'}
                  />
                  <button
                    onClick={executeCommand}
                    disabled={!command.trim() || isExecuting || selectedServerData?.status !== 'connected'}
                    className="p-2 hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-green-400" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Server className="w-16 h-16 text-text-light mx-auto mb-4" />
                <p className="text-xl text-text mb-2">Aucun serveur sélectionné</p>
                <p className="text-text-light">
                  Sélectionnez ou ajoutez un serveur pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout de serveur */}
      {isAddingServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Ajouter un serveur SSH</h2>
              <button
                onClick={() => setIsAddingServer(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); addServer(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Nom du serveur
                </label>
                <input
                  type="text"
                  required
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  className="input"
                  placeholder="Mon Serveur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Adresse (Host)
                </label>
                <input
                  type="text"
                  required
                  value={newServer.host}
                  onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
                  className="input"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Port
                </label>
                <input
                  type="number"
                  required
                  value={newServer.port}
                  onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) })}
                  className="input"
                  placeholder="22"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  required
                  value={newServer.username}
                  onChange={(e) => setNewServer({ ...newServer, username: e.target.value })}
                  className="input"
                  placeholder="root"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={newServer.password}
                  onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingServer(false)}
                  className="flex-1 btn-outline"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
