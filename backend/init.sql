-- ChatOps Commander - Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- SERVERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  hostname VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  port INTEGER DEFAULT 22,
  ssh_user VARCHAR(50) NOT NULL,
  ssh_key_path VARCHAR(255),
  ssh_password_encrypted TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'unknown', 'error')),
  last_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_servers_created_by ON servers(created_by);

-- ==========================================
-- CONVERSATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- ==========================================
-- MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- ==========================================
-- COMMANDS TABLE (Audit Trail)
-- ==========================================
CREATE TABLE IF NOT EXISTS commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  server_id UUID REFERENCES servers(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  command TEXT NOT NULL,
  parsed_intent JSONB,
  output TEXT,
  exit_code INTEGER,
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  confirmed BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMP DEFAULT NOW(),
  duration_ms INTEGER
);

CREATE INDEX idx_commands_user ON commands(user_id);
CREATE INDEX idx_commands_server ON commands(server_id);
CREATE INDEX idx_commands_executed ON commands(executed_at DESC);
CREATE INDEX idx_commands_risk ON commands(risk_level) WHERE risk_level IN ('high', 'critical');

-- ==========================================
-- PERMISSIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  can_read BOOLEAN DEFAULT TRUE,
  can_execute BOOLEAN DEFAULT FALSE,
  can_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

CREATE INDEX idx_permissions_user_server ON permissions(user_id, server_id);

-- ==========================================
-- ALERTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_alerts_unresolved ON alerts(server_id, resolved) WHERE NOT resolved;
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Update updated_at on users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- INITIAL DATA
-- ==========================================

-- Note: Le premier utilisateur créé sera automatiquement admin
-- Les credentials seront créés via l'interface de register

-- Exemple de serveurs de test (optionnel)
-- INSERT INTO servers (name, hostname, ip_address, ssh_user) VALUES
-- ('web-01', 'web-01.example.com', '192.168.1.10', 'admin'),
-- ('web-02', 'web-02.example.com', '192.168.1.11', 'admin'),
-- ('db-master', 'db.example.com', '192.168.1.20', 'postgres');

-- ==========================================
-- VIEWS UTILES
-- ==========================================

-- Vue: Statistiques utilisateur
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  COUNT(DISTINCT c.id) as conversation_count,
  COUNT(DISTINCT cmd.id) as command_count,
  MAX(cmd.executed_at) as last_command_at
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN commands cmd ON u.id = cmd.user_id
GROUP BY u.id, u.name, u.email, u.role;

-- Vue: Activité serveurs
CREATE OR REPLACE VIEW server_activity AS
SELECT 
  s.id,
  s.name,
  s.status,
  COUNT(cmd.id) as command_count,
  MAX(cmd.executed_at) as last_command_at
FROM servers s
LEFT JOIN commands cmd ON s.id = cmd.server_id
GROUP BY s.id, s.name, s.status;

-- ==========================================
-- FONCTIONS UTILES
-- ==========================================

-- Fonction: Nettoyer les vieilles conversations
CREATE OR REPLACE FUNCTION cleanup_old_conversations(days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM conversations
  WHERE updated_at < NOW() - (days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Obtenir les commandes dangereuses récentes
CREATE OR REPLACE FUNCTION get_risky_commands(hours INTEGER DEFAULT 24)
RETURNS TABLE (
  command_id UUID,
  user_email VARCHAR,
  server_name VARCHAR,
  command TEXT,
  risk_level VARCHAR,
  executed_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cmd.id,
    u.email,
    s.name,
    cmd.command,
    cmd.risk_level,
    cmd.executed_at
  FROM commands cmd
  JOIN users u ON cmd.user_id = u.id
  JOIN servers s ON cmd.server_id = s.id
  WHERE cmd.risk_level IN ('high', 'critical')
    AND cmd.executed_at > NOW() - (hours || ' hours')::INTERVAL
  ORDER BY cmd.executed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMMENTAIRES
-- ==========================================
COMMENT ON TABLE users IS 'Utilisateurs de l''application avec authentification';
COMMENT ON TABLE servers IS 'Serveurs gérés via SSH';
COMMENT ON TABLE conversations IS 'Conversations chat avec l''IA';
COMMENT ON TABLE messages IS 'Messages individuels dans les conversations';
COMMENT ON TABLE commands IS 'Audit trail de toutes les commandes exécutées';
COMMENT ON TABLE permissions IS 'Permissions granulaires par utilisateur et serveur';
COMMENT ON TABLE alerts IS 'Alertes système et monitoring';

-- ==========================================
-- FIN DU SCRIPT
-- ==========================================
VACUUM ANALYZE;