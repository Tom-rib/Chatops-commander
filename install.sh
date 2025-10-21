#!/bin/bash

# ChatOps Commander - Installation Automatique
# Ce script crée tous les fichiers et dossiers du projet

set -e

echo "🚀 ChatOps Commander - Installation Automatique"
echo "================================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Vérifications préalables
echo "📋 Vérification des prérequis..."
echo ""

if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Installez-le depuis https://docker.com"
fi
print_success "Docker installé ($(docker --version))"

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
fi
print_success "Docker Compose installé ($(docker-compose --version))"

if ! command -v node &> /dev/null; then
    print_warning "Node.js n'est pas installé (optionnel pour dev local)"
else
    print_success "Node.js installé ($(node -v))"
fi

echo ""
echo "📁 Création de la structure de dossiers..."
echo ""

# Créer les dossiers backend
mkdir -p backend/src/{api/routes,services/{ai,auth,execution,websocket},middleware,config,types,utils}
mkdir -p backend/logs
print_success "Dossiers backend créés"

# Créer les dossiers frontend
mkdir -p frontend/src/{components/{Chat,layout,ui},pages,services,store,types}
mkdir -p frontend/public
print_success "Dossiers frontend créés"

echo ""
echo "📝 Création du fichier .env..."
echo ""

if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Database
POSTGRES_USER=chatops
POSTGRES_PASSWORD=chatops_password_2024
POSTGRES_DB=chatops
DATABASE_URL=postgresql://chatops:chatops_password_2024@postgres:5432/chatops

# Redis
REDIS_URL=redis://redis:6379

# Backend
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
PORT=3001

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Frontend
REACT_APP_API_URL=http://localhost:3001
EOF
    print_success ".env créé (PENSEZ À MODIFIER LES VALEURS !)"
else
    print_warning ".env existe déjà, non modifié"
fi

echo ""
echo "📦 Installation des dépendances..."
echo ""

# Backend
if [ -f backend/package.json ]; then
    print_info "Installation des dépendances backend..."
    cd backend
    npm install
    cd ..
    print_success "Dépendances backend installées"
else
    print_warning "backend/package.json introuvable, ignoré"
fi

# Frontend
if [ -f frontend/package.json ]; then
    print_info "Installation des dépendances frontend..."
    cd frontend
    npm install
    cd ..
    print_success "Dépendances frontend installées"
else
    print_warning "frontend/package.json introuvable, ignoré"
fi

echo ""
echo "🐳 Initialisation de Docker..."
echo ""

# Construire les images
print_info "Construction des images Docker (cela peut prendre quelques minutes)..."
docker-compose build
print_success "Images Docker construites"

echo ""
echo "✨ Installation terminée !"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo ""
echo "1. Configurez votre clé API Anthropic dans .env"
echo "   ANTHROPIC_API_KEY=sk-ant-..."
echo ""
echo "2. Démarrez les services :"
echo "   make start"
echo "   # ou"
echo "   docker-compose up -d"
echo ""
echo "3. Accédez à l'application :"
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:3001"
echo ""
echo "4. Connectez-vous avec :"
echo "   Email    : admin@chatops.local"
echo "   Password : admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Commandes utiles :"
echo "   make start   - Démarrer tous les services"
echo "   make stop    - Arrêter tous les services"
echo "   make logs    - Voir les logs"
echo "   make clean   - Nettoyer le projet"
echo ""
echo "📚 Documentation : README.md"
echo ""
print_success "Bonne utilisation ! 🚀"