# AiSystant - Backend

Backend API pour AiSystant, un assistant IA intelligent pour DevOps.

## 🚀 Technologies

- **Node.js** + **TypeScript** - Runtime et langage
- **Express.js** - Framework web
- **Socket.IO** - Communication temps réel
- **PostgreSQL** - Base de données relationnelle
- **Redis** - Cache et sessions
- **Anthropic Claude** - Intelligence artificielle
- **JWT** - Authentification
- **bcrypt** - Hachage de mots de passe

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Redis 6+
- Clé API Anthropic

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

3. **Créer la base de données**
```bash
# Avec psql
psql -U postgres
CREATE DATABASE aisystant_db;
CREATE USER aisystant WITH PASSWORD 'aisystant_password';
GRANT ALL PRIVILEGES ON DATABASE aisystant_db TO aisystant;
\q
```

4. **Exécuter les migrations**
```bash
npm run migrate
```

5. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 🔧 Configuration

Éditez le fichier `.env` avec vos paramètres :

```env
# Serveur
PORT=3001
NODE_ENV=development

# Base de données
DATABASE_URL=postgresql://aisystant:aisystant_password@localhost:5432/aisystant_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=votre_secret_tres_securise
JWT_EXPIRES_IN=7d

# Claude AI
ANTHROPIC_API_KEY=votre_cle_api_anthropic
CLAUDE_MODEL=claude-sonnet-4-20250514

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Documentation

### Authentification

#### POST /api/auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login
Connexion

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Obtenir le profil de l'utilisateur connecté (authentifié)

**Headers:**
```
Authorization: Bearer <token>
```

### Chat

#### POST /api/chat/conversations
Créer une nouvelle conversation (authentifié)

#### GET /api/chat/conversations
Obtenir toutes les conversations (authentifié)

#### GET /api/chat/conversations/:id
Obtenir une conversation avec ses messages (authentifié)

#### POST /api/chat/conversations/:id/messages
Envoyer un message et obtenir une réponse de Claude (authentifié)

**Body:**
```json
{
  "content": "Comment créer un Dockerfile ?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": {...},
    "assistantMessage": {
      "content": "Pour créer un Dockerfile..."
    }
  }
}
```

#### DELETE /api/chat/conversations/:id
Supprimer une conversation (authentifié)

### WebSocket

Le serveur expose également une API WebSocket sur le même port pour la communication en temps réel.

**Événements:**
- `join_conversation` - Rejoindre une conversation
- `leave_conversation` - Quitter une conversation
- `new_message` - Nouveau message envoyé
- `message_received` - Message reçu
- `typing` - Utilisateur en train d'écrire
- `stop_typing` - Utilisateur a arrêté d'écrire

## 🏗️ Structure du Projet

```
backend/
├── src/
│   ├── config/          # Configuration (DB, Redis)
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── migrate.ts
│   ├── controllers/     # Logique métier
│   │   ├── AuthController.ts
│   │   └── ChatController.ts
│   ├── models/          # Modèles de données
│   │   ├── User.ts
│   │   ├── Conversation.ts
│   │   └── Message.ts
│   ├── routes/          # Routes API
│   │   ├── auth.ts
│   │   └── chat.ts
│   ├── services/        # Services externes
│   │   └── ClaudeService.ts
│   ├── middleware/      # Middlewares
│   │   └── auth.ts
│   └── server.ts        # Point d'entrée
├── package.json
├── tsconfig.json
└── .env.example
```

## 🧪 Tests

```bash
# Exécuter les tests
npm test

# Avec coverage
npm run test:coverage
```

## 📊 Scripts Disponibles

- `npm run dev` - Démarrer en mode développement
- `npm run build` - Compiler TypeScript
- `npm start` - Démarrer en production
- `npm run migrate` - Exécuter les migrations
- `npm test` - Exécuter les tests

## 🔒 Sécurité

- Mots de passe hachés avec bcrypt
- Authentification JWT
- Protection CORS
- Rate limiting
- Validation des entrées
- Headers de sécurité avec Helmet

## 🐛 Dépannage

### Erreur de connexion à PostgreSQL
Vérifiez que PostgreSQL est démarré :
```bash
sudo service postgresql status
sudo service postgresql start
```

### Erreur de connexion à Redis
Vérifiez que Redis est démarré :
```bash
sudo service redis status
sudo service redis start
```

### Erreur API Anthropic
Vérifiez votre clé API dans `.env` et vos quotas sur https://console.anthropic.com

## 📝 License

MIT
