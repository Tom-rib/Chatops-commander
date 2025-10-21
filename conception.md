# Document de Conception - ChatOps Commander

## 📋 Sommaire

1. [Présentation générale](#présentation-générale)
2. [Identité de marque](#identité-de-marque)
3. [Architecture technique](#architecture-technique)
4. [Modèles de données](#modèles-de-données)
5. [Flux utilisateur](#flux-utilisateur)
6. [Sécurité](#sécurité)
7. [Performance](#performance)
8. [Évolutivité](#évolutivité)

---

## 🎯 Présentation générale

### Vision

**ChatOps Commander** révolutionne l'administration système en permettant aux DevOps d'interagir avec leur infrastructure en langage naturel. Plus besoin de mémoriser des commandes complexes : parlez simplement à votre infrastructure.

### Mission

Rendre l'administration système accessible, efficace et sécurisée grâce à l'intelligence artificielle conversationnelle.

### Proposition de valeur

**Pour** les administrateurs système et DevOps  
**Qui** doivent gérer des infrastructures complexes  
**Notre produit est** une plateforme conversationnelle intelligente  
**Qui** permet de commander son infrastructure en langage naturel  
**Contrairement à** SSH, scripts bash, et outils CLI traditionnels  
**Notre solution** comprend le contexte, explique les actions, et sécurise les opérations critiques

### Valeurs fondamentales

1. **Simplicité** : Interface intuitive, apprentissage instantané
2. **Sécurité** : Confirmations, permissions, audit trail complet
3. **Transparence** : Explications claires de chaque action
4. **Fiabilité** : Actions prévisibles et réversibles
5. **Intelligence** : Comprend le contexte et anticipe les besoins

---

## 🎨 Identité de marque

### Nom

**ChatOps Commander**

**Variantes testées et rejetées :**
- OpsTalk (trop générique)
- InfraChat (manque de punch)
- CommandLine AI (prête à confusion)
- DevSpeak (pas assez pro)

**Pourquoi ChatOps Commander ?**
- ✅ Évoque directement le concept (Chat + Ops)
- ✅ "Commander" implique le contrôle et l'autorité
- ✅ Mémorable et prononçable
- ✅ Domaine .com disponible

### Slogan

**Principal :** "Parlez à votre infrastructure"

**Alternatives :**
- "L'administration système en langage humain"
- "Votre DevOps, simplement"
- "Infrastructure sur commande vocale"

### Logo

**Description :**
Terminal noir minimaliste avec une bulle de chat intégrée, style cyberpunk moderne avec accents néon.

**Symbolisme :**
- Terminal : Représente le monde système/DevOps
- Bulle de chat : Interface conversationnelle
- Fusion des deux : Pont entre humain et machine

**Variations :**
- Logo complet (avec texte)
- Icône seule (pour favicon, app mobile)
- Version monochrome (pour impression)
- Version simplifiée (petites tailles)

**Fichiers :**
```
assets/
├── logo-full.svg          # Logo complet vectoriel
├── logo-icon.svg          # Icône seule
├── logo-full.png          # PNG 2000x2000
├── logo-icon.png          # PNG 512x512
├── favicon.ico            # Pour web
└── logo-monochrome.svg    # Version N&B
```

### Palette de couleurs

**Couleurs primaires :**

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Neon Cyan** | `#00D9FF` | `0, 217, 255` | Accents, liens, boutons primaires |
| **Neon Green** | `#00FF88` | `0, 255, 136` | Succès, confirmations, status OK |
| **Deep Black** | `#0A0E1A` | `10, 14, 26` | Fond principal, terminal |
| **Slate Gray** | `#1E2538` | `30, 37, 56` | Surfaces, cards, panels |

**Couleurs secondaires :**

| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Warning Orange** | `#FF9500` | `255, 149, 0` | Avertissements, actions risquées |
| **Error Red** | `#FF3B30` | `255, 59, 48` | Erreurs, actions critiques |
| **Text Primary** | `#FFFFFF` | `255, 255, 255` | Texte principal |
| **Text Secondary** | `#8E94A3` | `142, 148, 163` | Texte secondaire, métadonnées |

**Mode clair (optionnel) :**

| Nom | Hex | Usage |
|-----|-----|-------|
| Background | `#F8FAFC` | Fond principal |
| Surface | `#FFFFFF` | Cards, panels |
| Primary | `#0EA5E9` | Boutons, liens |
| Text | `#0F172A` | Texte principal |

### Typographie

**Polices :**

1. **Titres et UI :** [Inter](https://fonts.google.com/specimen/Inter)
   - Moderne, lisible, excellent rendu écran
   - Weights : 400 (Regular), 600 (SemiBold), 700 (Bold)

2. **Code et Terminal :** [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
   - Monospace optimisée pour le code
   - Ligatures activées
   - Weight : 400 (Regular)

**Hiérarchie :**
```css
h1: Inter Bold 32px / 40px
h2: Inter SemiBold 24px / 32px
h3: Inter SemiBold 20px / 28px
Body: Inter Regular 16px / 24px
Small: Inter Regular 14px / 20px
Code: JetBrains Mono 14px / 20px
```

### Ton de voix

**Caractéristiques :**
- **Professionnel mais accessible** : Pas de jargon inutile
- **Confiant et rassurant** : "Je gère ça pour vous"
- **Clair et direct** : Pas de fluff, messages concis
- **Empathique** : Comprend les frustrations des admins

**Exemples :**

❌ **À éviter :**
> "Une erreur non identifiée s'est produite lors de l'exécution de votre requête système. Veuillez consulter les logs pour plus d'informations."

✅ **Préférer :**
> "Le serveur web-01 ne répond pas. J'ai vérifié : le service nginx est arrêté. Voulez-vous que je le redémarre ?"

**Guidelines :**
- Utiliser "je" pour l'IA, "vous" pour l'utilisateur
- Poser des questions plutôt que supposer
- Expliquer avant d'agir
- Célébrer les succès avec parcimonie (emoji ✅ OK, pas de 🎉)

### Iconographie

**Style :** Lucide React (consistant, moderne, open-source)

**Icônes principales :**
- Terminal : `<Terminal />` - Commande, CLI
- Server : `<Server />` - Infrastructure
- Shield : `<Shield />` - Sécurité
- Activity : `<Activity />` - Monitoring
- AlertTriangle : `<AlertTriangle />` - Warnings
- CheckCircle : `<CheckCircle />` - Succès
- XCircle : `<XCircle />` - Erreurs

---

## 🏗️ Architecture technique

### Vue d'ensemble

Architecture **trois tiers** classique avec composants découplés :

```
┌─────────────────────────────────────────────────────────┐
│                    TIER 1 : Frontend                     │
│                   React + TypeScript                     │
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │    Chat    │  │ Dashboard  │  │  Visualization  │   │
│  │ Interface  │  │  Monitoring│  │    Charts       │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ WebSocket + REST API
┌───────────────────────▼─────────────────────────────────┐
│                    TIER 2 : Backend                      │
│                  Node.js + Express                       │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API Gateway Layer                    │   │
│  │  Authentication • Rate Limiting • Validation      │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │               Services Layer                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │   AI     │  │ Command  │  │  Monitoring  │   │   │
│  │  │  Engine  │  │ Executor │  │   Service    │   │   │
│  │  └──────────┘  └──────────┘  └──────────────┘   │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │              Data Access Layer                     │   │
│  │  PostgreSQL • Redis • File System                 │   │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ SSH / API Calls
┌───────────────────────▼─────────────────────────────────┐
│                TIER 3 : Infrastructure                   │
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │  Servers   │  │   Docker   │  │   Monitoring    │   │
│  │   Linux    │  │ Containers │  │    Tools        │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Stack technique détaillée

#### Frontend

**Framework :** React 18.2+ avec TypeScript 5+

**Raisons :**
- ✅ Écosystème riche et mature
- ✅ Performance avec Virtual DOM
- ✅ Type safety avec TypeScript
- ✅ Large communauté et ressources

**Librairies principales :**
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "socket.io-client": "^4.7.0",
  "axios": "^1.6.0",
  "recharts": "^2.10.0",
  "react-markdown": "^9.0.0",
  "lucide-react": "^0.300.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^4.4.0"
}
```

**Structure de dossiers :**
```
frontend/src/
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatHistory.tsx
│   │   └── CommandSuggestions.tsx
│   ├── dashboard/
│   │   ├── ServerCard.tsx
│   │   ├── MetricsChart.tsx
│   │   └── AlertsList.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Chat.tsx
│   └── Settings.tsx
├── services/
│   ├── api.ts
│   ├── socket.ts
│   └── auth.ts
├── hooks/
│   ├── useChat.ts
│   ├── useServers.ts
│   └── useAuth.ts
├── store/
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── serversStore.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
└── types/
    ├── api.ts
    ├── chat.ts
    └── server.ts
```

#### Backend

**Runtime :** Node.js 20 LTS  
**Framework :** Express 4.18+  
**Language :** TypeScript 5+

**Raisons :**
- ✅ JavaScript end-to-end
- ✅ Excellent pour I/O asynchrone
- ✅ WebSocket natif
- ✅ Écosystème npm massif

**Librairies principales :**
```json
{
  "express": "^4.18.0",
  "socket.io": "^4.7.0",
  "@anthropic-ai/sdk": "^0.9.0",
  "pg": "^8.11.0",
  "redis": "^4.6.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "zod": "^3.22.0",
  "node-ssh": "^13.1.0",
  "winston": "^3.11.0"
}
```

**Structure de dossiers :**
```
backend/src/
├── api/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── servers.routes.ts
│   │   └── commands.routes.ts
│   └── controllers/
│       ├── authController.ts
│       ├── chatController.ts
│       └── serversController.ts
├── services/
│   ├── ai/
│   │   ├── AIEngine.ts
│   │   ├── prompts.ts
│   │   └── parser.ts
│   ├── execution/
│   │   ├── CommandExecutor.ts
│   │   ├── SSHClient.ts
│   │   └── validator.ts
│   ├── monitoring/
│   │   ├── MetricsCollector.ts
│   │   └── AlertManager.ts
│   └── auth/
│       ├── AuthService.ts
│       └── TokenManager.ts
├── models/
│   ├── User.ts
│   ├── Server.ts
│   ├── Conversation.ts
│   └── Command.ts
├── middleware/
│   ├── authentication.ts
│   ├── authorization.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── utils/
│   ├── logger.ts
│   ├── crypto.ts
│   └── validators.ts
├── types/
│   ├── express.d.ts
│   └── models.ts
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── environment.ts
└── app.ts
```

#### Base de données

**SGBD :** PostgreSQL 15+

**Raisons :**
- ✅ Robuste et fiable
- ✅ Transactions ACID
- ✅ JSON support natif
- ✅ Excellent pour données relationnelles

**Schéma :** Voir section [Modèles de données](#modèles-de-données)

#### Cache

**Solution :** Redis 7+

**Usages :**
- Sessions utilisateur
- Cache des réponses IA fréquentes
- Rate limiting
- PubSub pour WebSocket scaling

#### IA

**Provider :** Anthropic Claude API  
**Modèle :** claude-sonnet-4-20250514

**Intégration :**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: SYSTEM_PROMPT,
  messages: conversationHistory
});
```

### Diagrammes

#### Diagramme de séquence - Commande utilisateur

```
User          Frontend        Backend         AIEngine       SSHClient      Server
  │              │               │               │              │             │
  │─ Type cmd ──>│               │               │              │             │
  │              │─ Send WS ────>│               │              │             │
  │              │               │─ Parse ──────>│              │             │
  │              │               │<─ Intent ─────│              │             │
  │              │               │                              │             │
  │              │<─ Confirm? ───│                              │             │
  │<─ Display ───│               │                              │             │
  │              │               │                              │             │
  │─ Confirm ───>│               │                              │             │
  │              │─ Execute ────>│                              │             │
  │              │               │─────────────────── Connect ─>│             │
  │              │               │                              │─ Execute ──>│
  │              │               │                              │<─ Output ───│
  │              │               │<──────────────────── Result ─│             │
  │              │               │─ Explain ────>│              │             │
  │              │               │<─ Response ───│              │             │
  │              │<─ Result ─────│                              │             │
  │<─ Display ───│               │                              │             │
```

#### Diagramme d'architecture réseau

```
Internet
    │
    │ HTTPS (443)
    ▼
┌─────────────────┐
│   Load Balancer │ (optionnel, production)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Frontend      │
│   (Nginx)       │  Port 3000
│   React SPA     │
└────────┬────────┘
         │
         │ HTTP/WS
         ▼
┌─────────────────┐
│   Backend       │
│   (Node.js)     │  Port 3001
│   Express API   │
└────┬─────┬──────┘
     │     │
     │     │ SSH (22)
     │     ▼
     │  ┌──────────────┐
     │  │   Servers    │
     │  │   (Target)   │
     │  └──────────────┘
     │
     ▼
┌────────────────────┐
│   PostgreSQL       │  Port 5432
│   + Redis          │  Port 6379
└────────────────────┘
```

---

## 💾 Modèles de données

### Schéma PostgreSQL

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Servers table
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  hostname VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  port INTEGER DEFAULT 22,
  ssh_user VARCHAR(50) NOT NULL,
  ssh_key_path VARCHAR(255),
  tags JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'unknown',
  last_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- Commands table (audit trail)
CREATE TABLE commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  server_id UUID REFERENCES servers(id),
  conversation_id UUID REFERENCES conversations(id),
  command TEXT NOT NULL,
  parsed_intent JSONB,
  output TEXT,
  exit_code INTEGER,
  risk_level VARCHAR(20),
  confirmed BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMP DEFAULT NOW(),
  duration_ms INTEGER
);

CREATE INDEX idx_commands_user ON commands(user_id);
CREATE INDEX idx_commands_server ON commands(server_id);
CREATE INDEX idx_commands_executed ON commands(executed_at DESC);

-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  can_read BOOLEAN DEFAULT TRUE,
  can_execute BOOLEAN DEFAULT FALSE,
  can_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_alerts_unresolved ON alerts(server_id, resolved) WHERE NOT resolved;
```

### Types TypeScript

```typescript
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Server types
export interface Server {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  port: number;
  sshUser: string;
  sshKeyPath?: string;
  tags: string[];
  status: 'online' | 'offline' | 'unknown' | 'error';
  lastCheck?: Date;
  createdAt: Date;
  createdBy: string;
}

// Chat types
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    chart?: ChartData;
    confirmation?: ConfirmationData;
  };
  createdAt: Date;
}

export interface ParsedCommand {
  intent: 'monitoring' | 'action' | 'query' | 'configuration';
  confidence: number;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  targetServer?: string;
  targetService?: string;
}

// Command execution
export interface CommandResult {
  success: boolean;
  output: string;
  exitCode: number;
  durationMs: number;
  error?: string;
}
```

---

## 👤 Flux utilisateur

### User Journey Principal

1. **Connexion**
   - Landing page avec présentation
   - Login (email + password + 2FA optionnel)
   - Redirection vers dashboard

2. **Onboarding** (premier usage)
   - Tutorial interactif (5 minutes)
   - Ajout du premier serveur
   - Première commande guidée

3. **Usage quotidien**
   - Accès direct au chat
   - Commandes rapides fréquentes
   - Monitoring temps réel
   - Résolution d'incidents

4. **Gestion avancée**
   - Configuration de serveurs
   - Création de playbooks
   - Gestion d'équipe (admin)

### Scénarios d'usage détaillés

#### Scénario 1 : Check matinal

**Contexte :** Admin arrive le matin, veut vérifier que tout va bien

**Flux :**
```
User: "Bonjour, tout va bien ?"

Bot: "Bonjour ! 👋
     État de votre infrastructure :
     
     ✅ 5/5 serveurs opérationnels
     ✅ Tous les services critiques actifs
     ⚠️  1 alerte mineure :
        - disk usage sur db-master : 78%
     
     Besoin de détails ?"

User: "Non merci, c'est tout"

Bot: "Parfait ! Je reste disponible si besoin 🚀"
```

#### Scénario 2 : Incident en production

**Contexte :** Le site web ne répond plus

**Flux :**
```
User: "Le site est down, qu'est-ce qui se passe ?"

Bot: "Je vérifie immédiatement...
     
     🔍 Diagnostic :
     • Serveurs web-01, web-02 : OK
     • nginx sur web-01 : ❌ ARRÊTÉ (depuis 3 min)
     • nginx sur web-02 : ✅ actif
     • Load balancer : redirige vers web-02
     
     Cause probable : nginx crashed sur web-01
     Logs récents : [Segmentation fault]
     
     Actions possibles :
     1. Redémarrer nginx sur web-01
     2. Voir les logs complets
     3. Isoler web-01 temporairement"

User: "1"

Bot: "⚠️  Action critique
     Redémarrer nginx sur web-01 ?
     
     Impact : Service interrompu ~2s sur web-01
     Risque : FAIBLE (web-02 prend le relais)
     
     [Confirmer] [Annuler]"

User: "Confirmer"

Bot: "⏳ Redémarrage en cours...
     
     ✅ nginx redémarré avec succès
     • Durée : 1.8s
     • Status : active (running)
     • Tests de santé : PASSED
     • Site accessible : ✅
     
     Suggestion : Analyser les core dumps
     Commande : 'Montre les logs nginx de la dernière heure'"
```

#### Scénario 3 : Déploiement

**Contexte :** Déployer une nouvelle version

**Flux :**
```
User: "Deploy la v2.5.0 sur production"

Bot: "⚠️  Déploiement en production détecté
     
     Pré-checks :
     ✅ v2.5.0 existe dans le registry
     ✅ Tests passés en staging
     ⚠️  Pas de backup récent de la DB
     
     Recommandation : Backup avant deploy
     
     Voulez-vous :
     1. Backup DB puis deploy
     2. Deploy sans backup (risqué)
     3. Annuler"

User: "1"

Bot: "📦 Étape 1/4 : Backup base de données
     ⏳ En cours... (ETA: 2 min)
     
     ✅ Backup terminé (145 MB)
     Stocké dans : /backups/prod-db-2025-11-10.sql
     
     📦 Étape 2/4 : Pull image v2.5.0
     ⏳ En cours...
     
     ✅ Image pulled
     
     📦 Étape 3/4 : Rolling update (0% downtime)
     • web-01 : ⏳ updating...
     • web-01 : ✅ v2.5.0 (health OK)
     • web-02 : ⏳ updating...
     • web-02 : ✅ v2.5.0 (health OK)
     
     📦 Étape 4/4 : Smoke tests
     • Homepage : ✅ 200 OK (124ms)
     • API health : ✅ 200 OK (45ms)
     • Database : ✅ Connected
     
     🎉 Déploiement réussi !
     Version : v2.5.0
     Durée totale : 3m 42s
     Downtime : 0s"
```

---

## 🔒 Sécurité

### Authentification

**Méthode :** JWT (JSON Web Tokens)

**Flow :**
1. Login → Backend vérifie credentials
2. Si OK → Génère `accessToken` (15 min) + `refreshToken` (7 jours)
3. Frontend stocke tokens dans `httpOnly` cookies
4. Chaque requête → `accessToken` en header
5. Si expiré → Refresh automatique avec `refreshToken`

**Implémentation :**
```typescript
// Token generation
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET!,
  { expiresIn: '7d' }
);

// Middleware protection
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Authorization (RBAC)

**Rôles :**

| Rôle | Permissions |
|------|-------------|
| **Viewer** | Voir dashboard, historique, métriques. Pas d'exécution. |
| **Operator** | Tout Viewer + Exécuter commandes safe (monitoring, logs). |
| **Admin** | Tout Operator + Actions critiques + Gestion utilisateurs. |

**Matrice de permissions :**

| Action | Viewer | Operator | Admin |
|--------|--------|----------|-------|
| Voir dashboard | ✅ | ✅ | ✅ |
| Voir métriques | ✅ | ✅ | ✅ |
| Lire logs | ✅ | ✅ | ✅ |
| Check status | ✅ | ✅ | ✅ |
| Restart service | ❌ | ✅ | ✅ |
| Deploy app | ❌ | ⚠️ (avec approbation) | ✅ |
| Modifier config | ❌ | ❌ | ✅ |
| Gérer serveurs | ❌ | ❌ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ✅ |

**Middleware :**
```typescript
export const requireRole = (minRole: Role) => {
  return (req, res, next) => {
    const roleHierarchy = { viewer: 0, operator: 1, admin: 2 };
    
    if (roleHierarchy[req.user.role] >= roleHierarchy[minRole]) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

// Usage
router.post('/servers', authenticate, requireRole('admin'), createServer);
```

### Validation des inputs

**Librairie :** Zod pour validation TypeScript-first

**Exemples :**
```typescript
import { z } from 'zod';

// Validation commande
const commandSchema = z.object({
  message: z.string().min(1).max(1000),
  serverId: z.string().uuid().optional(),
  conversationId: z.string().uuid()
});

// Validation serveur
const serverSchema = z.object({
  name: z.string().min(3).max(100),
  hostname: z.string().regex(/^[a-zA-Z0-9.-]+$/),
  ipAddress: z.string().ip(),
  port: z.number().int().min(1).max(65535),
  sshUser: z.string().min(1).max(50)
});

// Middleware
export const validate = (schema: ZodSchema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };
};
```

### Sanitization des commandes

**Prévention injection SSH :**
```typescript
export class CommandSanitizer {
  private static DANGEROUS_CHARS = /[;&|`$(){}[\]<>]/g;
  
  static sanitize(command: string): string {
    // Remove dangerous characters
    let safe = command.replace(this.DANGEROUS_CHARS, '');
    
    // Limit length
    safe = safe.substring(0, 500);
    
    // Trim whitespace
    safe = safe.trim();
    
    return safe;
  }
  
  static isCommandSafe(command: string): boolean {
    // Whitelist approach
    const allowedCommands = [
      'systemctl', 'service', 'docker', 'ps', 'top',
      'df', 'free', 'uptime', 'tail', 'grep', 'cat'
    ];
    
    const firstWord = command.split(' ')[0];
    return allowedCommands.includes(firstWord);
  }
}
```

### Confirmations actions critiques

**Système de risk scoring :**
```typescript
export enum RiskLevel {
  LOW = 'low',        // Lecture seule
  MEDIUM = 'medium',  // Restart service
  HIGH = 'high',      // Deploy, config change
  CRITICAL = 'critical' // Delete, drop database
}

export class RiskEvaluator {
  static evaluate(parsedCommand: ParsedCommand): RiskLevel {
    const { intent, parameters } = parsedCommand;
    
    // Keywords matching
    if (intent === 'delete' || parameters.action === 'drop') {
      return RiskLevel.CRITICAL;
    }
    
    if (intent === 'deploy' || intent === 'configuration') {
      return RiskLevel.HIGH;
    }
    
    if (intent === 'action' && parameters.service) {
      return RiskLevel.MEDIUM;
    }
    
    return RiskLevel.LOW;
  }
  
  static requiresConfirmation(risk: RiskLevel): boolean {
    return risk !== RiskLevel.LOW;
  }
}
```

### Audit Trail

**Logging complet :**
- Toutes les commandes exécutées
- Qui, quand, quoi, sur quel serveur
- Résultat et durée
- Stocké en base + fichiers de logs

**Format log :**
```json
{
  "timestamp": "2025-11-10T14:32:15Z",
  "user": "john.doe@company.com",
  "userId": "uuid-here",
  "action": "COMMAND_EXECUTED",
  "command": "systemctl restart nginx",
  "serverId": "uuid-server",
  "serverName": "web-01",
  "riskLevel": "MEDIUM",
  "success": true,
  "exitCode": 0,
  "duration": 1847,
  "ipAddress": "192.168.1.100"
}
```

### Rate Limiting

**Protection contre abus :**
```typescript
import rateLimit from 'express-rate-limit';

// API générale
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: 'Trop de requêtes, réessayez dans 15 minutes'
});

// Commandes critiques
const commandLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 commandes max
  message: 'Ralentissez ! Max 10 commandes/minute'
});

// Login (anti brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion'
});

app.use('/api/', apiLimiter);
app.use('/api/commands', commandLimiter);
app.use('/api/auth/login', loginLimiter);
```

### Chiffrement

**Credentials serveurs :**
```typescript
import crypto from 'crypto';

export class Encryption {
  private static ALGORITHM = 'aes-256-gcm';
  private static KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  static decrypt(encrypted: string): string {
    const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage
const sshPassword = Encryption.encrypt(server.password);
await db.query('UPDATE servers SET password = $1', [sshPassword]);
```

### Headers de sécurité

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https://api.anthropic.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## ⚡ Performance

### Optimisations Frontend

**1. Code Splitting**
```typescript
// Lazy loading des routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));

// Dans App.tsx
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

**2. Memoization**
```typescript
// Components
const ChatMessage = React.memo(({ message }) => {
  return <div>{message.content}</div>;
});

// Values
const expensiveValue = useMemo(() => {
  return processData(data);
}, [data]);

// Callbacks
const handleSubmit = useCallback((text) => {
  sendMessage(text);
}, [sendMessage]);
```

**3. Virtualization**
```typescript
// Pour longs historiques de chat
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ChatMessage message={messages[index]} />
    </div>
  )}
</FixedSizeList>
```

**4. Assets optimization**
- Images WebP avec fallback
- SVG pour icônes
- Fonts subset (caractères utilisés uniquement)
- Bundle gzip/brotli

### Optimisations Backend

**1. Caching Redis**
```typescript
export class CacheService {
  private redis: Redis;
  
  async get(key: string): Promise<any> {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);
    return null;
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async remember(key: string, ttl: number, fn: () => Promise<any>): Promise<any> {
    const cached = await this.get(key);
    if (cached) return cached;
    
    const fresh = await fn();
    await this.set(key, fresh, ttl);
    return fresh;
  }
}

// Usage
const servers = await cache.remember('servers:all', 300, async () => {
  return await db.query('SELECT * FROM servers');
});
```

**2. Connection pooling**
```typescript
// PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Max 20 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**3. Query optimization**
```sql
-- Index pour recherches fréquentes
CREATE INDEX CONCURRENTLY idx_commands_user_date 
ON commands(user_id, executed_at DESC);

CREATE INDEX CONCURRENTLY idx_messages_conversation 
ON messages(conversation_id, created_at DESC);

-- Partitioning pour grandes tables
CREATE TABLE commands_2025_11 PARTITION OF commands
FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

**4. Async/Await & Promises**
```typescript
// Paralléliser les requêtes indépendantes
const [servers, alerts, metrics] = await Promise.all([
  getServers(),
  getAlerts(),
  getMetrics()
]);

// Au lieu de :
const servers = await getServers();
const alerts = await getAlerts();  // Attend inutilement
const metrics = await getMetrics(); // Attend inutilement
```

### Monitoring Performance

**Métriques clés :**
- Response time API < 200ms (p95)
- WebSocket latency < 50ms
- Frontend load time < 2s
- Time to Interactive < 3s
- IA response time < 3s (p95)

**Tools :**
- Lighthouse (Core Web Vitals)
- New Relic / Datadog (APM)
- Sentry (Error tracking)
- Prometheus + Grafana (métriques)

---

## 📈 Évolutivité

### Scaling Horizontal

**Architecture pour scale :**
```
                    ┌─────────────┐
                    │ Load Balancer│
                    │   (Nginx)    │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼────┐     ┌─────▼────┐
    │Backend 1│      │Backend 2 │     │Backend 3 │
    └────┬────┘      └─────┬────┘     └─────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                   ┌───────▼────────┐
                   │   PostgreSQL   │
                   │   (Primary)    │
                   │                │
                   │  ┌──────────┐  │
                   │  │ Replicas │  │
                   │  │ (Read)   │  │
                   └──┴──────────┴──┘
```

**Session management :**
- Redis pour sessions partagées entre instances
- Sticky sessions sur load balancer (optionnel)

**WebSocket scaling :**
```typescript
// Socket.io avec Redis adapter
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### Base de données

**Read replicas :**
- Master pour writes
- Replicas pour reads (monitoring, dashboard)

**Sharding par organisation :**
- Si multi-tenant, sharding par company_id
- Isolement des données clients

**Archivage :**
```sql
-- Déplacer vieux logs vers table archive
INSERT INTO commands_archive 
SELECT * FROM commands 
WHERE executed_at < NOW() - INTERVAL '90 days';

DELETE FROM commands 
WHERE executed_at < NOW() - INTERVAL '90 days';
```

### Microservices (V2)

**Séparation possible :**
- Auth Service
- AI Engine Service
- Execution Service
- Monitoring Service
- Notification Service

**Communication :**
- REST APIs
- Message queue (RabbitMQ/Redis)
- Event-driven architecture

---

## 🚀 Déploiement

### Docker Production

**Dockerfile optimisé :**
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

RUN apk add --no-cache dumb-init openssh-client

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER node
EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/app.js"]
```

### Environment Variables

```env
# Production .env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/chatops
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=<generate-strong-secret>
REFRESH_SECRET=<generate-strong-secret>
ENCRYPTION_KEY=<generate-256-bit-key>

# AI
ANTHROPIC_API_KEY=<your-api-key>

# Frontend
FRONTEND_URL=https://chatops-commander.com

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
```

### CI/CD Pipeline

**GitHub Actions :**
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker build -t chatops-commander .
          docker push chatops-commander:latest
          ssh server "docker-compose pull && docker-compose up -d"
```

---

**Document maintenu par** : L'équipe ChatOps Commander  
**Version** : 1.0  
**Dernière mise à jour** : 10 novembre 2025