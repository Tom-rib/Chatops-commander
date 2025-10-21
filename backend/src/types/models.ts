// ==========================================
// USER TYPES
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

// ==========================================
// SERVER TYPES
// ==========================================
export interface Server {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  port: number;
  sshUser: string;
  sshKeyPath?: string;
  sshPasswordEncrypted?: string;
  tags: string[];
  status: 'online' | 'offline' | 'unknown' | 'error';
  lastCheck?: Date;
  createdAt: Date;
  createdBy: string;
}

export interface CreateServerDto {
  name: string;
  hostname: string;
  ipAddress: string;
  port?: number;
  sshUser: string;
  sshKeyPath?: string;
  sshPassword?: string;
  tags?: string[];
}

// ==========================================
// CHAT TYPES
// ==========================================
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: MessageMetadata;
  createdAt: Date;
}

export interface MessageMetadata {
  chart?: ChartData;
  confirmation?: ConfirmationData;
  parsed?: ParsedCommand;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// AI TYPES
// ==========================================
export type CommandIntent = 'monitoring' | 'action' | 'query' | 'help' | 'configuration';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ParsedCommand {
  intent: CommandIntent;
  confidence: number;
  parameters: {
    server?: string;
    service?: string;
    action?: 'restart' | 'stop' | 'start' | 'status' | 'deploy' | string;
    timeRange?: '1h' | '24h' | '7d' | string;
    query?: string;
    [key: string]: any;
  };
  requiresConfirmation: boolean;
  riskLevel: RiskLevel;
  explanation: string;
}

// ==========================================
// COMMAND EXECUTION TYPES
// ==========================================
export interface CommandResult {
  success: boolean;
  output: string;
  exitCode: number;
  durationMs: number;
  error?: string;
}

export interface CommandRecord {
  id: string;
  userId: string;
  serverId: string;
  conversationId?: string;
  command: string;
  parsedIntent?: ParsedCommand;
  output?: string;
  exitCode?: number;
  riskLevel: RiskLevel;
  confirmed: boolean;
  executedAt: Date;
  durationMs?: number;
}

// ==========================================
// PERMISSION TYPES
// ==========================================
export interface Permission {
  id: string;
  userId: string;
  serverId: string;
  canRead: boolean;
  canExecute: boolean;
  canAdmin: boolean;
  createdAt: Date;
}

// ==========================================
// ALERT TYPES
// ==========================================
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  serverId: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

// ==========================================
// CHART DATA TYPES
// ==========================================
export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: ChartDataPoint[];
  xAxis?: string;
  yAxis?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

// ==========================================
// CONFIRMATION DATA TYPES
// ==========================================
export interface ConfirmationData {
  message: string;
  riskLevel: RiskLevel;
  action: string;
  target: string;
  impact?: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// WEBSOCKET EVENT TYPES
// ==========================================
export interface WebSocketEvent {
  type: 'message' | 'notification' | 'alert' | 'status';
  payload: any;
  timestamp: Date;
}

// ==========================================
// METRICS TYPES
// ==========================================
export interface ServerMetrics {
  serverId: string;
  serverName: string;
  cpu: number;
  memory: number;
  disk: number;
  network?: {
    rx: number;
    tx: number;
  };
  timestamp: Date;
}

// ==========================================
// JWT PAYLOAD TYPE
// ==========================================
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ==========================================
// REQUEST TYPES (Express extensions)
// ==========================================
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}