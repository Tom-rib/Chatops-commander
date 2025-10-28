# 🚀 AiSystant - Frontend

Interface moderne et réactive pour la gestion d'infrastructure via chat avec l'aide de l'IA.

## 📋 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling utility-first
- **Socket.IO Client** - Communication temps réel
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Lucide React** - Icons modernes

## 🎨 Charte Graphique

```javascript
colors: {
  primary: '#2F80ED',    // Bleu - Actions principales
  secondary: '#27AE60',  // Vert - Succès
  accent: '#F2994A',     // Orange - Alertes
  text: '#333333',       // Gris foncé - Texte
  background: '#F2FFF2', // Vert clair - Fond
}
```

## 📁 Structure

```
frontend/
├── public/                  # Assets statiques
│   ├── logo.svg            # Logo principal
│   ├── logo-192.png        # PWA icon
│   ├── logo-512.png        # PWA icon
│   ├── favicon.ico         # Favicon
│   ├── apple-touch-icon.png
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── Navbar.tsx
│   │   ├── ChatMessage.tsx
│   │   └── PrivateRoute.tsx
│   ├── pages/             # Pages de l'application
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Chat.tsx
│   │   └── SSH.tsx
│   ├── services/          # Services API
│   │   ├── api.ts
│   │   └── socket.ts
│   ├── context/           # Contextes React
│   │   └── AuthContext.tsx
│   ├── main.tsx           # Point d'entrée
│   ├── App.tsx            # Composant principal
│   └── index.css          # Styles globaux
└── ...fichiers de config
```

## 🚀 Installation

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0

### Étapes

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Éditer `.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

3. **Générer les assets (logos)**

Vous devez créer ces fichiers dans `public/`:
- `logo.svg` (200x200)
- `logo-192.png` (192x192)
- `logo-512.png` (512x512)
- `favicon.ico` (16x16, 32x32)
- `apple-touch-icon.png` (180x180)

**Méthode recommandée**: Utiliser DALL-E ou Midjourney avec ce prompt:
```
"Modern minimalist logo for ChatOps Commander, 
blue (#2F80ED) and green (#27AE60) colors, 
tech/devops theme, clean design, flat style"
```

4. **Créer manifest.json**

```json
{
  "name": "ChatOps Commander",
  "short_name": "ChatOps",
  "description": "Gestion d'infrastructure avec IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F2FFF2",
  "theme_color": "#2F80ED",
  "icons": [
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🏃 Démarrage

### Mode développement

```bash
npm run dev
```

Application disponible sur `http://localhost:3000`

### Build production

```bash
npm run build
```

Les fichiers seront dans `dist/`

### Prévisualisation production

```bash
npm run preview
```

## 🐳 Docker

### Build de l'image

```bash
docker build -t chatops-commander-frontend .
```

### Lancement

```bash
docker run -p 80:80 chatops-commander-frontend
```

## 🔧 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build pour la production |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | Vérifie le code |
| `npm run format` | Formate le code |
| `npm run type-check` | Vérifie les types |

## 🌐 Variables d'environnement

| Variable | Description | Par défaut |
|----------|-------------|------------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3001` |
| `VITE_WS_URL` | URL WebSocket | `ws://localhost:3001` |
| `VITE_APP_NAME` | Nom de l'application | `ChatOps Commander` |
| `VITE_APP_VERSION` | Version | `1.0.0` |

## 📱 Pages

### 🔐 Authentification
- `/login` - Connexion
- `/register` - Inscription

### 📊 Application
- `/dashboard` - Tableau de bord
- `/chat` - Interface de chat avec IA
- `/ssh` - Gestion SSH

## 🔌 Fonctionnalités

### ✅ Implémentées
- ✅ Authentification JWT
- ✅ Chat temps réel avec Socket.IO
- ✅ Interface responsive
- ✅ Gestion SSH
- ✅ Mode sombre/clair
- ✅ PWA ready

### 🚧 À venir
- Notifications push
- Historique des commandes
- Export de logs
- Multi-langue

## 🎯 Composants principaux

### `<Navbar />`
Barre de navigation avec:
- Logo cliquable
- Navigation
- Menu utilisateur
- Mode sombre

### `<ChatMessage />`
Affichage des messages:
- Messages utilisateur
- Messages IA
- Code highlighting
- Timestamps

### `<PrivateRoute />`
Protection des routes:
- Vérification auth
- Redirection login
- Chargement async

## 🔒 Sécurité

- ✅ Headers de sécurité (CSP, XSS, etc.)
- ✅ Validation côté client
- ✅ Tokens JWT
- ✅ HTTPS en production
- ✅ Protection CSRF

## 📈 Performance

- ⚡ Lazy loading des pages
- ⚡ Code splitting
- ⚡ Compression gzip
- ⚡ Cache des assets
- ⚡ Optimisation des images

## 🐛 Debug

### Problème de connexion au backend

```bash
# Vérifier que le backend tourne
curl http://localhost:3001/api/health

# Vérifier les variables d'environnement
cat .env
```

### Erreur Socket.IO

```bash
# Vérifier la configuration dans vite.config.ts
# Le proxy doit pointer vers le backend
```

## 📚 Documentation

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO](https://socket.io/)

## 👥 Support

Pour toute question ou problème:
1. Vérifier les logs du navigateur (F12)
2. Vérifier que le backend est lancé
3. Consulter la documentation

## 📄 Licence

MIT

---

**Créé avec ❤️ pour ChatOps Commander**
