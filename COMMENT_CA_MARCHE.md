# 🎓 ChatOps Commander - Comment Ça Marche

## 📚 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Flux de Données](#flux-de-données)
4. [Installation Complète](#installation-complète)
5. [Utilisation](#utilisation)
6. [Développement](#développement)
7. [Déploiement](#déploiement)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'Ensemble

ChatOps Commander est une application **full-stack** qui permet d'administrer des serveurs via une interface conversationnelle propulsée par l'IA Claude.

### Composants Principaux

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │ ←──→ │   Node.js   │ ←──→ │ PostgreSQL  │
│  Frontend   │      │   Backend   │      │   Database  │
└─────────────┘      └─────────────┘      └─────────────┘
                            ↓
                     ┌─────────────┐
                     │   Claude    │
                     │   AI API    │
                     └─────────────┘
                            ↓
                     ┌─────────────┐
                     │   Serveurs  │
                     │     SSH     │
                     └─────────────┘
```

---

## 🏗️ Architecture Technique

### Backend (Node.js + Express + TypeScript)

**Fichiers Principaux :**

```
backend/src/
├── app.ts                    # Point d'entrée, setup Express
├── api/routes/               # Routes API REST
│   ├── auth.routes.ts        # Authentification (login, register)
│   ├── chat.routes.ts        # Chat et commandes IA
│   └── servers.routes.ts     # Gestion des serveurs
├── services/
│   ├── ai/AIEngine.ts        # Moteur IA (Claude API)
│   ├── auth/AuthService.ts   # Authentification JWT
│   ├── execution/SSHClient.ts # Exécution SSH
│   └── websocket/socketManager.ts # WebSocket temps réel
├── middleware/
│   ├── authentication.ts     # Middleware auth JWT
│   └── errorHandler.ts       # Gestion des erreurs
├── config/
│   └── database.ts           # Configuration PostgreSQL
└── utils/
    └── logger.ts             # Logging Winston
```

**Comment ça fonctionne :**

1. **Express** écoute sur le port 3001
2. Les **routes** reçoivent les requêtes HTTP
3. Le **middleware d'auth** vérifie les tokens JWT
4. Les **services** exécutent la logique métier
5. Les **réponses** sont renvoyées au client

### Frontend (React + TypeScript)

**Structure :**

```
frontend/src/
├── App.tsx                   # Application principale
├── components/
│   └── Chat/
│       └── ChatInterface.tsx # Interface de chat
├── pages/
│   ├── Login.tsx             # Page de connexion
│   ├── Dashboard.tsx         # Tableau de bord
│   └── Chat.tsx              # Page de chat
├── services/
│   ├── api.ts                # Client API REST
│   └── socket.ts             # Client WebSocket
└── store/
    ├── authStore.ts          # State management auth
    └── chatStore.ts          # State management chat
```

**Technologies :**

- **React 18** : Framework UI
- **TailwindCSS** : Styling
- **Zustand** : State management
- **Socket.io-client** : WebSocket
- **Lucide React** : Icônes

### Base de Données (PostgreSQL)

**Tables Principales :**

```sql
users           -- Utilisateurs (admin, operator, viewer)
servers         -- Serveurs SSH gérés
conversations   -- Conversations chat
messages        -- Messages individuels
commands        -- Audit trail des commandes
permissions     -- Permissions granulaires
alerts          -- Alertes système
```

**Relations :**

```
users (1) ──→ (N) conversations
conversations (1) ──→ (N) messages
users (1) ──→ (N) commands
servers (1) ──→ (N) commands
```

---

## 🔄 Flux de Données

### Exemple : Exécuter "Redémarre nginx sur web-01"

**1. Frontend envoie le message**
```typescript
POST /api/chat/message
{
  "message": "Redémarre nginx sur web-01",
  "conversationId": "uuid"
}
```

**2. Backend reçoit et parse avec Claude**
```typescript
// chat.routes.ts
const parsed = await aiEngine.parseCommand(message, context);
```

**3. Claude répond avec un JSON**
```json
{
  "intent": "action",
  "confidence": 0.95,
  "parameters": {
    "server": "web-01",
    "service": "nginx",
    "action": "restart"
  },
  "requiresConfirmation": true,
  "riskLevel": "medium",
  "explanation": "Je vais redémarrer nginx sur web-01..."
}
```

**4. Backend demande confirmation**
```typescript
res.json({
  parsed,
  requiresConfirmation: true,
  message: parsed.explanation
});
```

**5. Utilisateur confirme**
```typescript
POST /api/chat/execute
{
  "serverId": "uuid",
  "command": "systemctl restart nginx"
}
```

**6. Backend exécute via SSH**
```typescript
await sshClient.connect(server);
const result = await sshClient.executeCommand(serverId, command);
```

**7. Backend explique le résultat**
```typescript
const explanation = await aiEngine.explainResult(command, result);
```

**8. Frontend affiche la réponse**
```
✅ nginx redémarré avec succès en 1.8s
```

---

## 💻 Installation Complète

### Prérequis

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 20+ (pour développement local)
- **Git**

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-username/chatops-commander.git
cd chatops-commander
```

### Étape 2 : Configuration

```bash
# Créer le fichier .env
cp .env.example .env

# Éditer .env et remplir :
nano .env
```

**Variables OBLIGATOIRES :**
```env
ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
JWT_SECRET=générer-avec-make-generate-secrets
REFRESH_SECRET=générer-avec-make-generate-secrets
ENCRYPTION_KEY=générer-avec-make-generate-secrets
DB_PASSWORD=choisir-un-mot-de-passe-fort
```

**Générer les secrets :**
```bash
make generate-secrets
```

### Étape 3 : Démarrer avec Docker

```bash
# Build des images
make build

# Démarrer tous les services
make start

# Vérifier que tout fonctionne
make health
```

**Services démarrés :**
- Frontend : http://localhost:3000
- Backend : http://localhost:3001
- PostgreSQL : port 5432
- Redis : port 6379

### Étape 4 : Premier Utilisateur

1. Ouvrir http://localhost:3000
2. Cliquer sur "S'inscrire"
3. Créer votre compte (sera automatiquement admin)
4. Se connecter

---

## 🎮 Utilisation

### 1. Ajouter un Serveur

**Via l'interface :**
1. Aller dans "Paramètres" → "Serveurs"
2. Cliquer "Ajouter un serveur"
3. Remplir :
   - Nom : `web-01`
   - Hostname : `web01.example.com`
   - IP : `192.168.1.10`
   - SSH User : `admin`
   - SSH Key Path : `/path/to/key.pem`

**Via le Chat :**
```
"Ajoute un serveur nommé web-01 avec IP 192.168.1.10"
```

### 2. Tester la Connexion

```
"Teste la connexion au serveur web-01"
```

### 3. Commandes de Monitoring

```
"Montre-moi l'état des serveurs"
"CPU de web-01"
"Utilisation mémoire des serveurs"
"Espace disque sur db-master"
```

### 4. Commandes d'Action

```
"Redémarre nginx sur web-01"
"Stop apache"
"Status de PostgreSQL"
"Liste les containers Docker"
```

### 5. Analyses de Logs

```
"Montre les logs nginx de la dernière heure"
"Erreurs dans les logs système"
```

---

## 🛠️ Développement

### Setup en Local (sans Docker)

**1. Backend**
```bash
cd backend

# Installer les dépendances
npm install

# Créer la base de données
createdb chatops
psql chatops < init.sql

# Démarrer en mode dev
npm run dev
```

**2. Frontend**
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode dev
npm start
```

### Structure du Code

**Backend - Ajouter une Route**

```typescript
// backend/src/api/routes/example.routes.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/authentication';

const router = Router();
router.use(authenticate);

router.get('/example', async (req, res) => {
  res.json({ message: 'Hello World' });
});

export { router as exampleRouter };
```

```typescript
// backend/src/app.ts
import { exampleRouter } from './api/routes/example.routes';
app.use('/api/example', exampleRouter);
```

**Frontend - Créer un Composant**

```tsx
// frontend/src/components/Example.tsx
import React from 'react';

export const Example: React.FC = () => {
  return (
    <div className="bg-[#1E2538] p-4 rounded-lg">
      <h2 className="text-white">Mon Composant</h2>
    </div>
  );
};
```

### Tests

**Backend**
```bash
cd backend
npm test                 # Tous les tests
npm run test:coverage    # Avec coverage
```

**Frontend**
```bash
cd frontend
npm test                 # Tests unitaires
npm run test:e2e         # Tests E2E
```

### Debugging

**Backend avec VS Code**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## 🚀 Déploiement

### Production avec Docker

```bash
# Sur le serveur de production
git clone https://github.com/votre-username/chatops-commander.git
cd chatops-commander

# Configuration
cp .env.example .env
nano .env  # Remplir les variables

# Build et démarrer
docker-compose up -d

# Vérifier
docker-compose ps
docker-compose logs -f
```

### Mise à Jour

```bash
git pull origin main
docker-compose down
docker-compose up --build -d
```

### Backup Base de Données

```bash
# Créer un backup
make backup

# Ou manuellement
docker exec chatops-db pg_dump -U chatops chatops > backup.sql

# Restaurer
docker exec -i chatops-db psql -U chatops chatops < backup.sql
```

---

## 🔧 Troubleshooting

### Le Backend ne Démarre Pas

**Erreur : `ANTHROPIC_API_KEY not found`**
```bash
# Vérifier le fichier .env
cat .env | grep ANTHROPIC

# Si vide, ajouter la clé
echo "ANTHROPIC_API_KEY=sk-ant-votre-cle" >> .env
```

**Erreur : `Cannot connect to database`**
```bash
# Vérifier que PostgreSQL tourne
docker-compose ps postgres

# Voir les logs
docker-compose logs postgres

# Redémarrer
docker-compose restart postgres
```

### Le Frontend ne Se Connecte Pas

**Erreur : `Failed to fetch`**
```bash
# Vérifier que le backend tourne
curl http://localhost:3001/health

# Vérifier CORS dans .env
FRONTEND_URL=http://localhost:3000
```

### SSH Ne Fonctionne Pas

**Erreur : `Connection refused`**
- Vérifier que le serveur cible a SSH activé
- Vérifier le firewall
- Tester manuellement : `ssh admin@192.168.1.10`

**Erreur : `Permission denied (publickey)`**
- Vérifier le chemin de la clé SSH
- Vérifier les permissions : `chmod 600 key.pem`
- Vérifier que la clé publique est dans `~/.ssh/authorized_keys` sur le serveur

### L'IA Ne Répond Pas

**Erreur : `Invalid API key`**
- Vérifier la clé Anthropic sur https://console.anthropic.com/
- Régénérer si nécessaire

**Erreur : `Timeout`**
- Vérifier la connexion internet
- Augmenter le timeout dans le code si nécessaire

---

## 📞 Support

- 📚 Documentation : Voir tous les fichiers .md du projet
- 🐛 Bugs : GitHub Issues
- 💬 Questions : Discord ou email

---

**Maintenu par l'équipe ChatOps Commander**  
**Dernière mise à jour : 2025**