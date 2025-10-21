# ⚡ ChatOps Commander - Démarrage Rapide (5 Minutes)

## 🎯 En Bref

ChatOps Commander = Interface de chat + IA Claude + Administration serveurs SSH

## 📋 Prérequis

- Docker & Docker Compose
- Une clé API Anthropic (gratuite sur https://console.anthropic.com/)
- 5 minutes ⏱️

## 🚀 Installation en 4 Commandes

```bash
# 1. Cloner
git clone https://github.com/votre-username/chatops-commander.git
cd chatops-commander

# 2. Configurer
cp .env.example .env
# Éditer .env et ajouter votre ANTHROPIC_API_KEY

# 3. Générer les secrets
make generate-secrets
# Copier les secrets dans .env

# 4. Démarrer
make build && make start
```

## ✅ Vérification

```bash
# Services en ligne ?
make health

# Logs en direct
make logs
```

**URLs :**
- Frontend : http://localhost:3000
- Backend : http://localhost:3001

## 👤 Premier Utilisateur

1. Ouvrir http://localhost:3000
2. Cliquer "S'inscrire"
3. Créer un compte (sera admin automatiquement)

## 🎮 Premiers Pas

### 1. Tester le Chat

```
"Bonjour !"
"Que peux-tu faire ?"
```

### 2. Ajouter un Serveur

Via l'interface : Paramètres → Serveurs → Ajouter

OU via le chat :
```
"Ajoute un serveur test avec IP 192.168.1.10"
```

### 3. Commandes Utiles

```
"Montre l'état des serveurs"
"CPU de web-01"
"Redémarre nginx"
"Liste les containers Docker"
```

## 🛑 Arrêter

```bash
make stop
```

## 🧹 Tout Nettoyer

```bash
make clean
```

## ⚠️ Problèmes Courants

**Backend ne démarre pas ?**
```bash
# Vérifier .env
cat .env | grep ANTHROPIC_API_KEY

# Voir les logs
docker-compose logs backend
```

**Port déjà utilisé ?**
```bash
# Trouver ce qui utilise le port
lsof -i :3000
lsof -i :3001

# Tuer le processus
kill -9 <PID>
```

**Erreur de connexion SSH ?**
- Vérifier que votre clé SSH est bien configurée
- Tester manuellement : `ssh user@server`

## 📚 Documentation Complète

- **README.md** : Vue d'ensemble
- **COMMENT_CA_MARCHE.md** : Explications détaillées
- **AGENTS.md** : Usage de l'IA
- **conception.md** : Architecture technique

## 💡 Commandes Make Utiles

```bash
make help          # Voir toutes les commandes
make logs-backend  # Logs backend uniquement
make logs-frontend # Logs frontend uniquement
make test          # Lancer les tests
make backup        # Backup DB
make restart       # Redémarrer
```

## 🎓 Pour Aller Plus Loin

1. **Personnaliser** : Modifier les couleurs dans le code
2. **Ajouter des serveurs** : Connecter votre infrastructure réelle
3. **Explorer** : Tester différentes commandes
4. **Contribuer** : Voir CONTRIBUTING.md

## 🆘 Support

**Besoin d'aide ?**
- Voir COMMENT_CA_MARCHE.md pour détails
- GitHub Issues pour bugs
- Discord pour questions

---

**C'est tout ! Vous êtes prêt à utiliser ChatOps Commander ! 🎉**