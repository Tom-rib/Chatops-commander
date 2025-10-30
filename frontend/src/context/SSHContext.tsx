import { createContext, useContext, useState, ReactNode } from 'react'

interface TerminalLine {
  id: string
  content: string
  type: 'command' | 'output' | 'error'
  timestamp: Date
}

interface SSHContextType {
  terminalHistory: Map<number, TerminalLine[]>
  selectedServer: number | null
  addTerminalLine: (serverId: number, content: string, type: 'command' | 'output' | 'error') => void
  clearTerminal: (serverId: number) => void
  setSelectedServerId: (serverId: number | null) => void
  getTerminalLines: (serverId: number) => TerminalLine[]
}

const SSHContext = createContext<SSHContextType | undefined>(undefined)

export function SSHProvider({ children }: { children: ReactNode }) {
  const [terminalHistory, setTerminalHistory] = useState<Map<number, TerminalLine[]>>(new Map())
  const [selectedServer, setSelectedServer] = useState<number | null>(null)

  const addTerminalLine = (serverId: number, content: string, type: 'command' | 'output' | 'error') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    }

    setTerminalHistory(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(serverId) || []
      newMap.set(serverId, [...existing, newLine])
      return newMap
    })
  }

  const clearTerminal = (serverId: number) => {
    setTerminalHistory(prev => {
      const newMap = new Map(prev)
      newMap.delete(serverId)
      return newMap
    })
  }

  const setSelectedServerId = (serverId: number | null) => {
    setSelectedServer(serverId)
  }

  const getTerminalLines = (serverId: number): TerminalLine[] => {
    return terminalHistory.get(serverId) || []
  }

  const value = {
    terminalHistory,
    selectedServer,
    addTerminalLine,
    clearTerminal,
    setSelectedServerId,
    getTerminalLines
  }

  return (
    <SSHContext.Provider value={value}>
      {children}
    </SSHContext.Provider>
  )
}

export function useSSH() {
  const context = useContext(SSHContext)
  if (!context) {
    throw new Error('useSSH must be used within SSHProvider')
  }
  return context
}