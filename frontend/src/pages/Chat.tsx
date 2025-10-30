import { useState, useEffect, useRef } from 'react'
import { Send, Loader, Plus, Trash2, MessageSquare, Bot } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { chatAPI } from '../services/api'
import { socketService } from '../services/socket'
import { useChat } from '../context/ChatContext'

interface Message {
  id: number
  content: string
  role: 'user' | 'assistant' | 'system'
  created_at: string
  conversation_id?: number
  user_id?: number
}

export default function Chat() {
  const {
    conversations,
    currentConversationId,
    setConversations,
    setCurrentConversationId,
    addConversation,
    removeConversation,
    setMessagesForConversation,
    addMessageToConversation,
    getMessagesForConversation,
  } = useChat()

  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = currentConversationId ? getMessagesForConversation(currentConversationId) : []

  useEffect(() => {
    if (conversations.length === 0) {
      loadConversations()
    } else if (currentConversationId && messages.length === 0) {
      loadMessages(currentConversationId)
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      socketService.connect(token)
      
      socketService.onNewMessage((message) => {
        if (currentConversationId) {
          addMessageToConversation(currentConversationId, message)
        }
      })
    }

    return () => {
      // socketService.disconnect()
    }
  }, [conversations.length, currentConversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations()
      const convs = response.data.data || response.data.conversations || []
      setConversations(convs)
      
      if (convs.length > 0 && !currentConversationId) {
        loadMessages(convs[0].id)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error)
    }
  }

  const loadMessages = async (conversationId: number) => {
    const cachedMessages = getMessagesForConversation(conversationId)
    if (cachedMessages.length > 0) {
      setCurrentConversationId(conversationId)
      return
    }

    setIsLoading(true)
    setCurrentConversationId(conversationId)
    
    try {
      const response = await chatAPI.getConversation(conversationId)
      const data = response.data.data
      
      const msgs = data.messages || data.conversation?.messages || []
      setMessagesForConversation(conversationId, msgs)
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
      setMessagesForConversation(conversationId, [])
    } finally {
      setIsLoading(false)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await chatAPI.createConversation('Nouvelle conversation')
      const newConv = response.data.data
      
      if (newConv?.id) {
        addConversation(newConv)
        setCurrentConversationId(newConv.id)
        setMessagesForConversation(newConv.id, [])
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error)
    }
  }

  const deleteConversation = async (conversationId: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette conversation ?')) return

    try {
      await chatAPI.deleteConversation(conversationId)
      removeConversation(conversationId)
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        
        if (conversations.length > 1) {
          const remaining = conversations.filter(c => c.id !== conversationId)
          if (remaining.length > 0) {
            loadMessages(remaining[0].id)
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversationId || isSending) return

    const messageContent = inputMessage.trim()
    setInputMessage('')
    setIsSending(true)

    const tempUserMessage: Message = {
      id: Date.now(),
      content: messageContent,
      role: 'user',
      created_at: new Date().toISOString(),
      conversation_id: currentConversationId,
    }
    addMessageToConversation(currentConversationId, tempUserMessage)

    try {
      const response = await chatAPI.sendMessage(currentConversationId, messageContent)
      const data = response.data.data
      
      if (data.userMessage && data.assistantMessage) {
        const currentMessages = getMessagesForConversation(currentConversationId)
        const withoutTemp = currentMessages.filter(m => m.id !== tempUserMessage.id)
        setMessagesForConversation(currentConversationId, [
          ...withoutTemp,
          data.userMessage,
          data.assistantMessage
        ])
        
        const convResponse = await chatAPI.getConversations()
        const convs = convResponse.data.data || convResponse.data.conversations || []
        setConversations(convs)
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error)
      
      const currentMessages = getMessagesForConversation(currentConversationId)
      const withoutTemp = currentMessages.filter(m => m.id !== tempUserMessage.id)
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: `Erreur: ${error.response?.data?.message || error.message || 'Une erreur est survenue'}`,
        role: 'system',
        created_at: new Date().toISOString(),
      }
      setMessagesForConversation(currentConversationId, [...withoutTemp, errorMessage])
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
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={createNewConversation}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle conversation</span>
            </button>
          </div>

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
                      currentConversationId === conv.id
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
                          {new Date(conv.created_at).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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

        <div className="flex-1 flex flex-col">
          {currentConversationId ? (
            <>
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
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage 
                        key={message.id} 
                        message={{
                          ...message,
                          timestamp: message.created_at
                        }} 
                      />
                    ))}
                    {isSending && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Loader className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-text-light text-sm">Claude réfléchit...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

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
