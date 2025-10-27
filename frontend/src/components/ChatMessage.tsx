import { User, Bot, Copy, Check } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useState } from 'react'

interface ChatMessageProps {
  message: {
    id: string
    content: string
    role: 'user' | 'assistant' | 'system'
    timestamp: Date | string
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return format(date, 'HH:mm', { locale: fr })
  }

  // Détecter si le message contient du code
  const hasCode = message.content.includes('```')
  
  // Parser le code markdown
  const parseContent = (content: string) => {
    if (!hasCode) return content

    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '')
        const language = part.match(/```(\w+)/)?.[1] || 'text'
        
        return (
          <div key={index} className="relative my-4">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
              <span className="text-xs text-gray-400 uppercase">{language}</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copier le code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="code-block rounded-t-none">
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      
      // Remplacer les retours à la ligne par des <br />
      return (
        <span key={index} dangerouslySetInnerHTML={{ 
          __html: part.replace(/\n/g, '<br />') 
        }} />
      )
    })
  }

  if (isSystem) {
    return (
      <div className="message-system">
        <p className="text-sm text-accent-700 font-medium">
          {message.content}
        </p>
        <p className="text-xs text-text-lighter mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-secondary'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-lg p-4 shadow-sm ${
            isUser 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-text'
          }`}>
            <div className="text-sm whitespace-pre-wrap break-words">
              {parseContent(message.content)}
            </div>
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-text-lighter mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}
