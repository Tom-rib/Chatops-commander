#!/bin/bash

# AiSystant - Installation Automatique COMPLÈTE
# Ce script installe TOUT : dossiers, dépendances, et gère les conflits

set -e

echo "🚀 AiSystant - Installation Automatique Complète"
echo "=========================================================="
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

print_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# ============================================================
# ÉTAPE 1 : VÉRIFICATION DES PRÉREQUIS
# ============================================================

print_step "📋 ÉTAPE 1/6 : Vérification des prérequis"

if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Installez-le depuis https://docker.com"
fi
print_success "Docker installé ($(docker --version))"

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
fi
print_success "Docker Compose installé ($(docker-compose --version))"

if ! command -v node &> /dev/null; then
    print_warning "Node.js n'est pas installé (requis pour installation locale)"
    print_warning "L'installation des dépendances npm sera sautée"
    SKIP_NPM=true
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warning "Node.js version < 18 détectée. Version 18+ recommandée."
    fi
    print_success "Node.js installé ($(node -v))"
    SKIP_NPM=false
fi

# ============================================================
# ÉTAPE 2 : CRÉATION DE LA STRUCTURE
# ============================================================

print_step "📁 ÉTAPE 2/6 : Création de la structure de dossiers"

# Backend
print_info "Création des dossiers backend..."
mkdir -p backend/src/{api/routes,services/{ai,auth,execution,websocket},middleware,config,types,utils}
mkdir -p backend/logs
print_success "Dossiers backend créés"

# Frontend
print_info "Création des dossiers frontend..."
mkdir -p frontend/src/{components/{Chat,layout,ui},pages,services,store,types}
mkdir -p frontend/public
print_success "Dossiers frontend créés"

# ============================================================
# ÉTAPE 3 : CONFIGURATION .ENV
# ============================================================

print_step "📝 ÉTAPE 3/6 : Configuration de l'environnement"

if [ -f .env ]; then
    print_warning ".env existe déjà, création de .env.backup"
    cp .env .env.backup
fi

cat > .env << 'EOF'
# Database
POSTGRES_USER=aisystant
POSTGRES_PASSWORD=aisystant_password
POSTGRES_DB=aisystant
DATABASE_URL=postgresql://aisystant:aisystant_password@postgres:5432/aisystant

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

print_success ".env créé"
print_warning "⚠️  N'oubliez pas de modifier ANTHROPIC_API_KEY dans .env !"

# ============================================================
# ÉTAPE 4 : INSTALLATION DES DÉPENDANCES BACKEND
# ============================================================

print_step "🔧 ÉTAPE 4/6 : Installation des dépendances backend"

if [ "$SKIP_NPM" = true ]; then
    print_warning "Node.js non disponible, installation sautée"
    print_info "Les dépendances seront installées dans Docker"
else
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        print_info "Installation des dépendances backend..."
        cd backend
        
        # Installation standard
        npm install
        
        print_success "Dépendances backend installées"
        cd ..
    else
        print_warning "package.json backend non trouvé, installation sautée"
    fi
fi

# ============================================================
# ÉTAPE 5 : INSTALLATION DES DÉPENDANCES FRONTEND
# ============================================================

print_step "🎨 ÉTAPE 5/6 : Installation des dépendances frontend"

if [ "$SKIP_NPM" = true ]; then
    print_warning "Node.js non disponible, installation sautée"
    print_info "Les dépendances seront installées dans Docker"
else
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        print_info "Installation des dépendances frontend..."
        cd frontend
        
        # Nettoyage pour éviter les conflits
        print_info "Nettoyage des anciennes dépendances..."
        rm -rf node_modules package-lock.json
        
        # Installation avec --legacy-peer-deps pour gérer le conflit TypeScript
        print_info "Installation avec résolution des conflits TypeScript..."
        npm install --legacy-peer-deps
        
        # Installation des dépendances supplémentaires
        print_info "Installation de Zustand..."
        npm install zustand --legacy-peer-deps
        
        print_info "Installation d'Axios..."
        npm install axios --legacy-peer-deps
        
        print_info "Installation de Socket.io client..."
        npm install socket.io-client --legacy-peer-deps
        
        print_info "Installation de React Router..."
        npm install react-router-dom --legacy-peer-deps
        
        print_info "Installation des types TypeScript..."
        npm install --save-dev @types/react-router-dom --legacy-peer-deps
        
        print_success "Dépendances frontend installées"
        print_info "Note: Utilisé --legacy-peer-deps pour résoudre le conflit TypeScript 5.x vs react-scripts 5.0.1"
        cd ..
    else
        print_warning "package.json frontend non trouvé, installation sautée"
    fi
fi

# ============================================================
# ÉTAPE 6 : BUILD DOCKER
# ============================================================

print_step "🐳 ÉTAPE 6/6 : Construction des images Docker"

print_info "Construction des images Docker (peut prendre 5-10 minutes)..."
print_warning "Cette étape peut être longue la première fois..."

if docker-compose build; then
    print_success "Images Docker construites avec succès"
else
    print_error "Erreur lors de la construction des images Docker"
fi

# ============================================================
# RÉSUMÉ ET PROCHAINES ÉTAPES
# ============================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Installation terminée avec succès !${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⚠️  ACTION REQUISE :${NC}"
echo ""
echo "1️⃣  Configurez votre clé API Anthropic :"
echo "   nano .env"
echo "   Modifiez : ANTHROPIC_API_KEY=sk-ant-votre-clé-ici"
echo ""
echo "2️⃣  (Optionnel) Générez un JWT secret sécurisé :"
echo "   openssl rand -hex 32"
echo "   Puis copiez-le dans .env (JWT_SECRET=...)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🚀 DÉMARRAGE :${NC}"
echo ""
echo "Option 1 (avec Makefile) :"
echo "   make start"
echo ""
echo "Option 2 (Docker Compose direct) :"
echo "   docker-compose up -d"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📊 VÉRIFICATION :${NC}"
echo ""
echo "Vérifier les services :"
echo "   docker-compose ps"
echo ""
echo "Voir les logs :"
echo "   docker-compose logs -f"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🌐 ACCÈS :${NC}"
echo ""
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:3001"
echo ""
echo "   Compte par défaut :"
echo "   Email    : admin@aisystant.com"
echo "   Password : admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📚 DOCUMENTATION :${NC}"
echo ""
echo "   Guide complet    : GUIDE_COMPLET.md"
echo "   Troubleshooting  : FIX_BUILD.md"
echo "   Architecture     : ARCHITECTURE_COMPLETE.md"
echo "   Fix TypeScript   : FIX_TYPESCRIPT.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✨ Bonne utilisation de AiSystant !${NC}"
echo ""