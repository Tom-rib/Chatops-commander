# 🎯 ChatOps Commander - Guide Complet d'Installation et d'Utilisation

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Rapide](#installation-rapide)
3. [Installation Manuelle](#installation-manuelle)
4. [Configuration](#configuration)
5. [Démarrage](#démarrage)
6. [Comment ça Marche](#comment-ça-marche)
7. [Utilisation](#utilisation)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prérequis

### Obligatoires

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git**

### Optionnels (pour développement local)

- **Node.js** 20+
- **npm** ou **yarn**
- **PostgreSQL** 15+ (si vous ne voulez pas utiliser Docker)

### Obtenir une Clé API Anthropic

1. Créez un compte sur https://console.anthropic.com
2. Allez dans **API Keys**
3. Créez une nouvelle clé
4. Copiez-la (elle commence par `sk-ant-...`)

---

## ⚡ Installation Rapide (Recommandée)

```bash
# 1. Cloner le projet
git clone https://github.com/votre-nom/chatops-commander.git
cd chatops-commander

# 2. Rendre le script exécutable
chmod +x install.sh

# 3. Lancer l'installation automatique
./install.sh

# 4. Modifier le fichier .env avec votre clé API
nano .env
# Remplacez: ANTHROPIC_API_KEY=your_anthropic_api_key_here
# Par: ANTHROPIC_API_KEY=sk-ant-votre-clé-ici

# 5. Démarrer l'application
make start
# ou
docker-compose up -d
```

**C'est tout ! 🎉**

Accédez à http://localhost:3000 et connectez-vous avec :
- Email: `admin@chatops.local`
- Password: `admin123`

---

## 🔨 Installation Manuelle

Si vous préférez tout faire manuellement :

### Étape 1 : Créer la Structure

```bash
# Backend
mkdir -p backend/src/{api/routes,services/{ai,auth,execution,websocket},middleware,config,types,utils}
mkdir -p backend/logs

# Frontend
mkdir -p frontend/src/{components/{Chat,layout,ui},pages,services,store,types}
mkdir -p frontend/public
```

### Étape 2 : Copier les Fichiers

Copiez tous les fichiers fournis dans les artifacts vers leur emplacement :

**Configuration racine :**
- `.gitignore`
- `.env.example` → `.env` (puis modifiez)
- `docker-compose.yml`
- `Makefile`

**Backend :**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/Dockerfile`
- `backend/init.sql`
- Tous les fichiers dans `backend/src/`

**Frontend :**
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- Tous les fichiers dans `frontend/src/`

### Étape 3 : Installer les Dépendances

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Étape 4 : Construire et Démarrer

```bash
docker-compose build
docker-compose up -d
```

---

## ⚙️ Configuration

### Fichier .env

Voici les variables importantes à configurer :

```bash
# 🔐 Base de données (modifier en production)
POSTGRES_USER=chatops
POSTGRES_PASSWORD=changez_moi_en_production
POSTGRES_DB=chatops

# 🔑 JWT Secret (IMPORTANT : générez un secret unique)
JWT_SECRET=$(openssl rand -hex 32)

# 🤖 Clé API Anthropic (OBLIGATOIRE)
ANTHROPIC_API_KEY=sk-ant-votre-clé-ici

# 🌐 URLs
REACT_APP_API_URL=http://localhost:3001
```

### Génerer un JWT Secret Sécurisé

```bash
# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Démarrage

### Avec Make (Recommandé)

```bash
make start    # Démarre tous les services
make stop     # Arrête tous les services
make restart  # Redémarre tous les services
make logs     # Affiche les logs
make clean    # Nettoie le projet
make ps       # Statut des conteneurs
```

### Avec Docker Compose

```bash
docker-compose up -d          # Démarre en arrière-plan
docker-compose logs -f        # Voir les logs en temps réel
docker-compose down           # Arrête et supprime les conteneurs
docker-compose ps             # Voir le statut
```

### En Mode Développement (Local)

**Backend :**
```bash
cd backend
npm run dev     # Lance avec nodemon (hot reload)
```

**Frontend :**
```bash
cd frontend
npm start       # Lance React en mode dev
```

---

## 🧠 Comment ça Marche

### Architecture Globale

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Frontend   │────────▶│   Backend   │
│  (React)    │         │  (Nginx)    │         │  (Node.js)  │
└─────────────┘         └─────────────┘         └─────────────┘
                                                        │
                        ┌───────────────────────────────┼────────────────┐
                        │                               │                │
                        ▼                               ▼                ▼
                ┌─────────────┐              ┌─────────────┐  ┌─────────────┐
                │  Claude AI  │              │ PostgreSQL  │  │    Redis    │
                │   (API)     │              │     (DB)    │  │   (Cache)   │
                └─────────────┘              └─────────────┘  └─────────────┘
```

### Flux d'une Requête

1. **Utilisateur tape** : "Status de web-01"

2. **Frontend** :
   - Capture le message
   - Envoie POST `/api/chat` avec le texte
   - WebSocket écoute pour les mises à jour

3. **Backend** :
   - Reçoit la requête
   - Vérifie l'authentification JWT
   - Appelle `AIEngine.parse()` avec Claude

4. **Claude AI** :
   - Analyse l'intention : "monitoring"
   - Extrait paramètres : `{server: "web-01"}`
   - Retourne JSON structuré

5. **Backend** :
   - Reçoit le parsing
   - Exécute l'action (SSHClient.execute())
   - Retourne le résultat au frontend

6. **Frontend** :
   - Affiche la réponse dans le chat
   - Met à jour l'UI

### Composants Clés

#### 1. Frontend (React)

**ChatInterface.tsx** : Interface de chat principale
```typescript
// Gère l'historique, l'envoi de messages, l'affichage
```

**Pages/** : Dashboard, Chat, Servers
**Components/ui/** : Composants réutilisables (Button, Input, Card)

#### 2. Backend (Node.js + TypeScript)

**AIEngine.ts** : Moteur IA principal
```typescript
// Parsing de langage naturel → JSON structuré
// Utilise l'API Claude pour comprendre les commandes
```

**SSHClient.ts** : Exécution de commandes
```typescript
// Connexion SSH aux serveurs
// Exécution sécurisée de commandes
```

**auth.routes.ts** : Authentification JWT
**chat.routes.ts** : Routes du chat
**servers.routes.ts** : Gestion des serveurs

#### 3. Base de Données (PostgreSQL)

**Tables principales** :
- `users` : Utilisateurs
- `servers` : Serveurs gérés
- `conversations` : Historique des chats
- `commands` : Commandes exécutées

#### 4. Cache (Redis)

- Sessions utilisateurs
- Contexte des conversations
- Cache des résultats

---

## 💡 Utilisation

### Première Connexion

1. Accédez à http://localhost:3000
2. Connectez-vous :
   - Email: `admin@chatops.local`
   - Password: `admin123`

### Ajouter un Serveur

**Via l'interface :**
1. Allez dans **Serveurs** → **Ajouter un serveur**
2. Remplissez :
   - Nom : `web-01`
   - Hôte : `192.168.1.10`
   - Port : `22`
   - Username : `admin`
   - Mot de passe ou clé SSH

**Via le chat :**
```
Vous : Ajoute le serveur web-01 à 192.168.1.10
Bot : ✅ Serveur web-01 ajouté avec succès !
```

### Exemples de Commandes

**Monitoring :**
```
Vous : Status de tous les serveurs
Vous : CPU de web-01
Vous : Mémoire utilisée sur db-master
Vous : Espace disque de web-02
```

**Actions :**
```
Vous : Redémarre nginx sur web-01
Vous : Stop apache sur web-02
Vous : Liste les containers Docker sur app-01
```

**Queries :**
```
Vous : Logs nginx des 2 dernières heures
Vous : Processus qui utilisent le plus de CPU
Vous : Services actifs sur web-01
```

---

## 🐛 Troubleshooting

### Problème : "Cannot connect to the Docker daemon"

```bash
# Vérifier que Docker tourne
sudo systemctl status docker

# Démarrer Docker
sudo systemctl start docker
```

### Problème : "Port 3000 already in use"

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
```

### Problème : "Frontend ne se connecte pas au backend"

1. Vérifier que le backend tourne :
```bash
docker-compose ps
curl http://localhost:3001/health
```

2. Vérifier les variables d'environnement :
```bash
# Dans frontend/.env
REACT_APP_API_URL=http://localhost:3001
```

### Problème : "Claude API key invalid"

1. Vérifier votre clé dans `.env` :
```bash
cat .env | grep ANTHROPIC_API_KEY
```

2. La clé doit commencer par `sk-ant-`

3. Tester la clé :
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":100,"messages":[{"role":"user","content":"test"}]}'
```

### Problème : Base de données ne démarre pas

```bash
# Voir les logs PostgreSQL
docker-compose logs postgres

# Réinitialiser la base
docker-compose down -v
docker-compose up -d postgres

# Attendre 10 secondes puis vérifier
docker-compose ps
```

### Problème : "Module not found" dans le frontend

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Logs Utiles

```bash
# Tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

---

## 📊 Tests

### Tester le Backend

```bash
cd backend
npm test                 # Tous les tests
npm run test:watch      # Mode watch
npm run test:coverage   # Avec couverture
```

### Tester le Frontend

```bash
cd frontend
npm test                # Tous les tests
npm test -- --coverage  # Avec couverture
```

### Test E2E Manuel

1. **Démarrer l'application**
```bash
make start
```

2. **Tester l'authentification**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chatops.local","password":"admin123"}'
```

3. **Tester le chat**
```bash
TOKEN="votre_token_ici"
curl -X POST http://localhost:3001/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"status de tous les serveurs"}'
```

---

## 🔒 Sécurité

### Checklist de Production

- [ ] Changer tous les mots de passe par défaut
- [ ] Générer un nouveau `JWT_SECRET`
- [ ] Utiliser HTTPS (certificat SSL)
- [ ] Activer les rate limits
- [ ] Configurer les CORS correctement
- [ ] Utiliser des secrets Docker/Kubernetes
- [ ] Activer les logs d'audit
- [ ] Mettre à jour les dépendances régulièrement
- [ ] Sauvegarder la base de données

### Générer des Secrets Sécurisés

```bash
# JWT Secret (32 bytes)
openssl rand -hex 32

# PostgreSQL Password
openssl rand -base64 24

# Redis Password
openssl rand -base64 24
```

---

## 🚀 Déploiement en Production

### Option 1 : VPS (DigitalOcean, Linode, etc.)

```bash
# 1. Sur votre serveur
git clone https://github.com/votre-nom/chatops-commander.git
cd chatops-commander

# 2. Configurer .env pour production
cp .env.example .env
nano .env
# Modifier toutes les valeurs sensibles

# 3. Démarrer avec Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 4. Configurer Nginx reverse proxy
# Voir le fichier nginx-reverse-proxy.conf fourni
```

### Option 2 : Kubernetes

```bash
# Créer les secrets
kubectl create secret generic chatops-secrets \
  --from-literal=jwt-secret=$(openssl rand -hex 32) \
  --from-literal=db-password=$(openssl rand -base64 24) \
  --from-literal=anthropic-key=sk-ant-votre-clé

# Déployer
kubectl apply -f k8s/
```

### Option 3 : Cloud (AWS, GCP, Azure)

Utilisez les fichiers Terraform fournis dans le dossier `infrastructure/`

---

## 📚 Documentation Complète

### Fichiers de Documentation

- **README.md** : Vue d'ensemble du projet
- **AGENTS.md** : Utilisation de l'IA (Claude, Copilot, etc.)
- **CHANGELOG.md** : Historique des versions
- **conception.md** : Architecture technique détaillée
- **benchmarks.md** : Comparaison des outils IA
- **prompts.md** : Tous les prompts utilisés
- **GUIDE_COMPLET.md** : Ce fichier

### API Documentation

La documentation de l'API est disponible à : http://localhost:3001/api-docs

### Contribuer

1. Fork le projet
2. Créez une branche : `git checkout -b feature/ma-feature`
3. Committez : `git commit -m "Ajout de ma feature"`
4. Push : `git push origin feature/ma-feature`
5. Créez une Pull Request

---

## 🎓 Ressources

### Liens Utiles

- **Anthropic API** : https://docs.anthropic.com
- **React** : https://react.dev
- **Node.js** : https://nodejs.org
- **Docker** : https://docs.docker.com
- **PostgreSQL** : https://postgresql.org/docs
- **Tailwind CSS** : https://tailwindcss.com

### Tutoriels Vidéo

(À créer et publier sur YouTube)

### Support

- **Issues GitHub** : https://github.com/votre-nom/chatops-commander/issues
- **Discord** : (lien à créer)
- **Email** : support@chatops-commander.io

---

## 📝 Checklist Complète d'Installation

Utilisez cette checklist pour vous assurer que tout est en place :

### Avant l'Installation

- [ ] Docker installé et fonctionnel
- [ ] Docker Compose installé
- [ ] Git configuré
- [ ] Clé API Anthropic obtenue
- [ ] Node.js installé (optionnel)

### Installation

- [ ] Projet cloné depuis GitHub
- [ ] Fichier .env créé et configuré
- [ ] `ANTHROPIC_API_KEY` définie
- [ ] `JWT_SECRET` généré
- [ ] Mots de passe modifiés
- [ ] Dépendances backend installées
- [ ] Dépendances frontend installées

### Configuration

- [ ] Base de données initialisée
- [ ] Redis fonctionnel
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion frontend ↔ backend OK
- [ ] Connexion backend ↔ Claude API OK

### Test

- [ ] Connexion avec admin@chatops.local
- [ ] Dashboard s'affiche correctement
- [ ] Chat répond aux messages
- [ ] Commandes simples fonctionnent
- [ ] Ajout de serveur OK
- [ ] Exécution de commandes SSH OK

### Production (optionnel)

- [ ] Tous les secrets changés
- [ ] HTTPS configuré
- [ ] Logs configurés
- [ ] Sauvegardes automatiques
- [ ] Monitoring en place
- [ ] DNS configuré

---

## 🎉 Félicitations !

Vous avez maintenant une installation complète de **ChatOps Commander** !

### Prochaines Étapes

1. **Explorez l'interface** : Testez toutes les fonctionnalités
2. **Ajoutez vos serveurs** : Connectez votre infrastructure réelle
3. **Personnalisez** : Adaptez le code à vos besoins
4. **Partagez** : Invitez votre équipe
5. **Contribuez** : Améliorez le projet sur GitHub

### Besoin d'Aide ?

- Consultez la documentation complète dans les fichiers .md
- Rejoignez notre communauté Discord
- Ouvrez une issue sur GitHub
- Contactez-nous par email

**Bonne utilisation ! 🚀**