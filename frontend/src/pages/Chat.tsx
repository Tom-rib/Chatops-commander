import { useState, useEffect, useRef } from 'react'
import { Send, Loader, Plus, Trash2, MessageSquare, Bot } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { chatAPI } from '../services/api'
import { socketService } from '../services/socket'
import { useAuth } from '../context/AuthContext'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date | string
}

interface Conversation {
  id: string
  title: string
  createdAt: string
}

export default function Chat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les conversations au montage
  useEffect(() => {
    loadConversations()
    
    // Connecter le socket
    const token = localStorage.getItem('token')
    if (token) {
      socketService.connect(token)
      
      // Écouter les nouveaux messages
      socketService.onNewMessage((message) => {
        setMessages(prev => [...prev, message])
      })
    }

    return () => {
      socketService.disconnect()
    }
  }, [])

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations()
      setConversations(response.data.conversations || [])
      
      // Sélectionner la première conversation par défaut
      if (response.data.conversations?.length > 0 && !currentConversation) {
        loadMessages(response.data.conversations[0].id)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true)
    try {
      const response = await chatAPI.getMessages(conversationId)
      setMessages(response.data.messages || [])
      setCurrentConversation(conversationId)
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await chatAPI.createConversation('Nouvelle conversation')
      const newConv = response.data.conversation
      setConversations(prev => [newConv, ...prev])
      setCurrentConversation(newConv.id)
      setMessages([])
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error)
    }
  }

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette conversation ?')) return

    try {
      await chatAPI.deleteConversation(conversationId)
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      
      if (currentConversation === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsSending(true)

    try {
      const response = await chatAPI.sendMessage(currentConversation, inputMessage)
      
      if (response.data.message) {
        setMessages(prev => [...prev, response.data.message])
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        role: 'system',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar - Liste des conversations */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={createNewConversation}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle conversation</span>
            </button>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-text-light mx-auto mb-4" />
                <p className="text-text-light">Aucune conversation</p>
                <p className="text-sm text-text-lighter mt-2">
                  Créez-en une nouvelle pour commencer
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-all ${
                      currentConversation === conv.id
                        ? 'bg-primary-50 border-2 border-primary'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => loadMessages(conv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-text-light mt-1">
                          {new Date(conv.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone de chat principale */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="loading w-12 h-12 mb-4"></div>
                      <p className="text-text-light">Chargement des messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bot className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-text mb-4">
                        Prêt à vous aider ! 🤖
                      </h2>
                      <p className="text-text-light mb-6">
                        Posez-moi n'importe quelle question sur la gestion de votre infrastructure,
                        l'exécution de commandes SSH, ou demandez-moi de l'aide.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg text-left">
                          <p className="font-medium text-blue-900">💡 Exemples</p>
                          <p className="text-blue-700 text-xs mt-1">
                            "Liste mes serveurs"
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-left">
                          <p className="font-medium text-green-900">🚀 Commandes</p>
                          <p className="text-green-700 text-xs mt-1">
                            "Vérifie l'espace disque"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tapez votre message... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
                        className="input resize-none"
                        rows={3}
                        disabled={isSending}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isSending}
                      className="btn-primary px-6 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Envoi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Envoyer</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-text-lighter mt-2">
                    L'IA peut faire des erreurs. Vérifiez les informations importantes.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-text-light mx-auto mb-4" />
                <p className="text-xl text-text mb-2">Aucune conversation sélectionnée</p>
                <p className="text-text-light">
                  Créez ou sélectionnez une conversation pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
