# 🤖 AiSystant

<div align="center">

![AiSystant Logo](https://via.placeholder.com/200x200/00D9FF/0A0E1A?text=AiSystant)

**Parlez à votre infrastructure en langage naturel**

[![License: MIT](https://img.shields.io/badge/License-MIT-cyber--cyan.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-cyber--green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://docker.com)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.5-purple.svg)](https://anthropic.com)

[Démarrage Rapide](#-démarrage-rapide) • [Documentation](#-documentation) • [Démo](#-démo) • [Contribuer](#-contribuer)

</div>

---

## 📖 À Propos

**AiSystant** est une plateforme moderne de gestion d'infrastructure qui utilise l'**IA générative** pour transformer le langage naturel en commandes système. Dites simplement "redémarre nginx sur web-01" et laissez l'IA faire le reste !

### ✨ Fonctionnalités Principales

🗣️ **Interface Conversationnelle**
- Chat en langage naturel (français/anglais)
- Compréhension contextuelle des commandes
- Confirmations intelligentes pour actions critiques

🧠 **IA Puissante (Claude Sonnet 4.5)**
- Parsing d'intentions avancé
- Extraction automatique de paramètres
- Évaluation des risques

🖥️ **Gestion Multi-Serveurs**
- Support SSH natif
- Tags et groupes de serveurs
- Monitoring temps réel

📊 **Dashboard Intuitif**
- Vue d'ensemble de l'infrastructure
- Métriques en temps réel
- Historique des commandes

🔒 **Sécurité Robuste**
- Authentification JWT
- Permissions par rôle (Admin/Operator/Viewer)
- Audit trail complet
- Confirmations pour actions à risque

---

## 🚀 Démarrage Rapide

### Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- Clé API Anthropic ([obtenir une clé](https://console.anthropic.com))

### Installation en 3 minutes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-nom/chatops-commander.git
cd chatops-commander

# 2. Installation automatique
chmod +x install.sh
./install.sh

# 3. Configurer la clé API
nano .env
# Modifier: ANTHROPIC_API_KEY=sk-ant-votre-clé-ici

# 4. Démarrer
make start
```

🎉 **C'est prêt !** Accédez à http://localhost:3000

**Identifiants de démo :**
- Email: `admin@chatops.local`
- Password: `admin123`

---

## 💬 Exemples d'Utilisation

```
Vous : Status de tous les serveurs
Bot  : 📊 3 serveurs : 2 en ligne, 1 hors ligne

Vous : CPU de web-01 ?
Bot  : 🖥️ CPU web-01 : 23% (normal)

Vous : Redémarre nginx sur web-01
Bot  : ⚠️  Action critique - Confirmer ?
Vous : Oui
Bot  : ✅ nginx redémarré avec succès (1.8s)

Vous : Logs des 2 dernières heures
Bot  : 📝 [Affiche les logs avec timestamps]
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TIER 1 : Frontend                     │
│                React + TypeScript + Tailwind             │
│                 Chat Interface + Dashboard                │
└────────────────────┬────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────┐
│                    TIER 2 : Backend                      │
│              Node.js + Express + TypeScript              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ AIEngine │  │   Auth   │  │   SSH    │              │
│  │ (Claude) │  │  (JWT)   │  │  Client  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────┬───────────────┬────────────────────────────┘
             │               │
    ┌────────▼──────┐   ┌───▼─────────┐
    │  PostgreSQL   │   │    Redis    │
    │   (Données)   │   │   (Cache)   │
    └───────────────┘   └─────────────┘
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**GUIDE_COMPLET.md**](GUIDE_COMPLET.md) | Guide d'installation et d'utilisation détaillé |
| [**AGENTS.md**](AGENTS.md) | Utilisation de l'IA (Claude, Copilot, GPT-4) |
| [**conception.md**](conception.md) | Architecture technique complète |
| [**CHANGELOG.md**](CHANGELOG.md) | Historique des versions |
| [**benchmarks.md**](benchmarks.md) | Comparaison des outils IA |
| [**prompts.md**](prompts.md) | Tous les prompts utilisés |

---

## 🛠️ Stack Technique

### Frontend
- **React** 18.2 - Interface utilisateur
- **TypeScript** 5 - Type safety
- **Tailwind CSS** 3.4 - Styling moderne
- **Zustand** - State management
- **Socket.io** - WebSocket temps réel

### Backend
- **Node.js** 20 - Runtime JavaScript
- **Express** 4.18 - Framework web
- **TypeScript** 5 - Type safety
- **PostgreSQL** 15 - Base de données
- **Redis** 7 - Cache et sessions
- **node-ssh** - Client SSH
- **Anthropic SDK** - Intégration Claude AI

### DevOps
- **Docker** & **Docker Compose** - Containerisation
- **Nginx** - Reverse proxy
- **Jest** - Tests unitaires
- **ESLint** & **Prettier** - Qualité de code

---

## 🎯 Roadmap

### ✅ Version 1.0 (Actuelle)
- [x] Interface chat conversationnelle
- [x] Parsing intelligent avec Claude
- [x] Gestion multi-serveurs SSH
- [x] Dashboard temps réel
- [x] Authentification & permissions
- [x] Tests unitaires (87% coverage)
- [x] Documentation complète

### 🚧 Version 1.1 (Q1 2025)
- [ ] Support Kubernetes
- [ ] Intégrations (Slack, Discord, Teams)
- [ ] Playbooks automatisés
- [ ] Analytics avancés avec ML

### 🔮 Version 2.0 (Q2 2025)
- [ ] Multi-cloud (AWS, GCP, Azure)
- [ ] Prédiction de pannes par IA
- [ ] Marketplace de plugins
- [ ] Application mobile

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. **Créez** une branche : `git checkout -b feature/ma-feature`
3. **Committez** : `git commit -m "Ajout de ma feature"`
4. **Push** : `git push origin feature/ma-feature`
5. **Ouvrez** une Pull Request

### Guidelines

- Suivre les conventions de code (ESLint + Prettier)
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Respecter le code of conduct

---

## 📊 Statistiques du Projet

- **~8000** lignes de code
- **42** fichiers
- **87%** test coverage
- **25+** composants React
- **15** routes API
- **7** fichiers de documentation

---

## 🏆 Utilisation de l'IA Générative

Ce projet a été développé en utilisant massivement l'IA générative :

- **~75%** du code généré par **GitHub Copilot**
- **Architecture** conçue avec **Claude Sonnet 4.5**
- **Tests** générés par **GPT-4**
- **Visuels** créés avec **DALL-E 3**
- **Documentation** assistée par **Claude**

Voir [AGENTS.md](AGENTS.md) pour tous les détails.

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Votre Nom**
- GitHub: [@votre-nom](https://github.com/Tom-rib)
- LinkedIn: [Votre Profil](www.linkedin.com/in/tom-ribero-462ba2339)
- Email: tom.ribero@laplateforme.io

---

## 🙏 Remerciements

- **Anthropic** pour l'API Claude
- **GitHub** pour Copilot
- **La communauté open-source**

---

## 📞 Support

- 📖 [Documentation](GUIDE_COMPLET.md)
- 🐛 [Signaler un bug](https://github.com/votre-nom/chatops-commander/issues)
- 💬 [Discord](https://discord.gg/votre-lien)
- 📧 [Email](mailto:support@chatops-commander.io)

---

<div align="center">

**⭐ Si ce projet vous plaît, donnez-lui une étoile sur GitHub ! ⭐**

Made with ❤️ and 🤖 AI

</div>
