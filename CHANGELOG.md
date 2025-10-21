# Changelog

Tous les changements notables de ChatOps Commander sont documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### À venir
- Support Kubernetes
- Intégration Slack/Discord/Teams
- Playbooks automatisés
- Dashboard analytics avancé
- Mode hors-ligne

---

## [1.0.0] - 2025-11-10 🎉

### Première version de production !

**Version majeure initiale de ChatOps Commander**

Cette release marque la fin du projet "Temps Plein - IA" et le début d'un produit utilisable en production (environnement contrôlé).

### Ajouté
- Interface de chat conversationnelle complète
- Authentification JWT avec refresh tokens
- Parsing intelligent des commandes via Claude AI
- Système de permissions (Admin, Operator, Viewer)
- Audit trail de toutes les actions
- Dashboard de monitoring temps réel
- Support multi-serveurs SSH
- Visualisations automatiques (CPU, RAM, Disk)
- Confirmations pour actions critiques
- Historique des conversations
- Mode sombre/clair
- Responsive design (desktop, tablet, mobile)
- Documentation complète (README, AGENTS, etc.)
- Tests unitaires (87% coverage)
- Docker & Docker Compose setup

### Sécurité
- Validation des inputs côté serveur
- Rate limiting sur l'API
- Sanitization des commandes SSH
- Chiffrement des credentials stockés
- Headers de sécurité (CORS, CSP, etc.)

---

## [0.9.0] - 2025-11-08

### Version Beta - Features complètes

### Ajouté
- Visualisations de données avec Recharts
- Export des conversations en Markdown
- Système de notifications temps réel
- Support des graphiques personnalisés
- Commandes batch pour actions multiples

### Modifié
- Interface utilisateur améliorée
- Performance WebSocket optimisée
- Messages d'erreur plus clairs
- Temps de réponse IA réduit de 30%

### Corrigé
- Bug de reconnexion WebSocket
- Fuite mémoire dans le parser IA
- Problème d'affichage des graphiques sur Safari

---

## [0.8.0] - 2025-11-05

### Alpha 3 - Polish et optimisations

### Ajouté
- Suggestions de commandes pendant la frappe
- Shortcuts clavier (Ctrl+K pour focus, Esc pour annuler)
- Mode "expert" avec commandes avancées
- Timeline visuelle de l'historique

### Modifié
- Architecture backend refactorisée
- Composants React optimisés (React.memo)
- Bundle size réduit de 40%

### Corrigé
- Problème de scroll automatique du chat
- Échappement incorrect des caractères spéciaux
- Race condition dans l'exécution de commandes

---

## [0.7.0] - 2025-11-03

### Alpha 2 - Features principales

### Ajouté
- Monitoring en temps réel (CPU, RAM, Disk)
- Gestion des services système (start, stop, restart)
- Analyse des logs avec recherche intelligente
- Système de confirmations pour actions critiques
- Support Docker (liste containers, logs, stats)

### Modifié
- UI/UX du chat amélioré
- Prompts système optimisés pour Claude
- Gestion d'erreurs plus robuste

### Corrigé
- Timeout sur commandes longues
- Parsing incorrect des réponses multi-lignes
- Problème de contexte dans conversations longues

---

## [0.6.0] - 2025-11-01

### Alpha 1 - Premiers déploiements

### Ajouté
- Configuration Docker multi-conteneurs
- Variables d'environnement sécurisées
- Scripts de démarrage automatisés
- Healthchecks pour tous les services
- Logs centralisés

### Modifié
- Structure de la base de données optimisée
- Architecture réseau Docker isolée

---

## [0.5.0] - 2025-10-30

### Prototype - Features backend essentielles

### Ajouté
- API REST complète (/auth, /chat, /servers, /commands)
- Intégration Claude AI pour parsing
- Système d'exécution SSH sécurisé
- Base de données PostgreSQL
- Cache Redis pour sessions
- WebSocket pour temps réel

### Sécurité
- Middleware d'authentification JWT
- Validation Zod des inputs
- Sanitization des commandes

---

## [0.4.0] - 2025-10-28

### Prototype - Interface utilisateur

### Ajouté
- Composant Chat avec bulles de message
- Système de routing React Router
- Page de login/register
- Dashboard de base
- Composants UI réutilisables (Button, Input, Card)
- Theme provider (dark/light mode)

### Modifié
- Design system unifié avec Tailwind
- Animations et transitions fluides

---

## [0.3.0] - 2025-10-26

### POC - Moteur IA

### Ajouté
- Service AIEngine avec Claude
- Système de prompts structurés
- Parser d'intentions (monitoring, action, query)
- Extracteur de paramètres
- Évaluateur de risques

### Tests
- Tests unitaires du parser (20 scenarios)
- Validation des outputs JSON

---

## [0.2.0] - 2025-10-24

### POC - Setup infrastructure

### Ajouté
- Structure de projet (monorepo frontend/backend)
- Configuration TypeScript strict
- ESLint + Prettier
- Git hooks avec Husky
- Fichiers Docker de base
- Configuration Jest pour tests

### Documentation
- README initial
- AGENTS.md structure
- Contributing guidelines

---

## [0.1.0] - 2025-10-22

### Initial commit - Conception

### Ajouté
- Architecture initiale documentée
- Maquettes Figma de l'UI
- Schéma de base de données
- Choix technologiques validés
- Identité visuelle (logo, couleurs, fonts)

### Documentation
- conception.md complet
- benchmarks.md des outils IA
- prompts.md avec conversations d'idéation

---

## Notes de version

### [1.0.0] - Release Notes détaillées

**Points forts de cette release :**

1. **Interface intuitive** : Chat conversationnel avec retour visuel immédiat
2. **IA puissante** : Comprend le langage naturel et le contexte
3. **Sécurité robuste** : Authentification, permissions, confirmations
4. **Performance** : WebSocket temps réel, réponses < 2s
5. **Extensibilité** : Architecture modulaire prête pour plugins

**Limitations connues :**

- Supporte uniquement SSH (pas encore Kubernetes)
- Pas d'intégration Slack/Discord native
- Historique limité à 100 conversations
- Un seul utilisateur concurrent par serveur cible
- Pas de support Windows pour les serveurs cibles

**Configuration minimale requise :**

- **Serveur** : 2 vCPU, 4GB RAM, 20GB stockage
- **Clients** : Navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+)
- **Réseau** : Connexion SSH vers serveurs cibles

**Migration depuis 0.9.0 :**

```bash
# Backup de la base de données
docker exec chatops-db pg_dump -U postgres chatops > backup.sql

# Pull nouvelle version
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up --build -d

# Migrations automatiques au démarrage
```

**Remerciements :**

Merci à toute l'équipe pédagogique de La Plateforme pour l'encadrement de ce projet. Merci également à Anthropic et OpenAI pour leurs APIs qui ont rendu ce projet possible.

---

## Guide de versionnage

Ce projet suit le [Semantic Versioning 2.0.0](https://semver.org/lang/fr/)

Format : `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles de l'API
- **MINOR** : Ajout de fonctionnalités (rétrocompatible)
- **PATCH** : Corrections de bugs (rétrocompatible)

Exemples :
- `1.0.0` → `1.0.1` : Correction de bugs
- `1.0.1` → `1.1.0` : Nouvelle feature (compatible)
- `1.1.0` → `2.0.0` : Breaking change

### Branches

- `main` : Version stable de production
- `develop` : Prochaine version en développement
- `feature/*` : Nouvelles fonctionnalités
- `hotfix/*` : Corrections urgentes

### Tags Git

Chaque version est taguée :
```bash
git tag -a v1.0.0 -m "Release 1.0.0 - Production ready"
git push origin v1.0.0
```

---

**Maintenu par** : L'équipe ChatOps Commander  
**Dernière mise à jour** : 10 novembre 2025