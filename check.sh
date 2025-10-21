#!/bin/bash

# ChatOps Commander - Script de Vérification
# Vérifie que tous les fichiers nécessaires sont présents

set -e

echo "🔍 ChatOps Commander - Vérification du Projet"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

total_files=0
missing_files=0
present_files=0

check_file() {
    local file=$1
    local description=$2
    total_files=$((total_files + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file ${BLUE}($description)${NC}"
        present_files=$((present_files + 1))
    else
        echo -e "${RED}❌${NC} $file ${YELLOW}MANQUANT${NC} - $description"
        missing_files=$((missing_files + 1))
    fi
}

check_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} Dossier: $dir"
    else
        echo -e "${RED}❌${NC} Dossier manquant: $dir"
    fi
}

echo "📁 Vérification de la structure..."
echo ""

# Dossiers principaux
check_dir "backend/src"
check_dir "frontend/src"
check_dir "frontend/public"

echo ""
echo "📄 Fichiers racine..."
echo ""

check_file ".gitignore" "Fichiers à ignorer"
check_file ".env.example" "Variables d'environnement exemple"
check_file "docker-compose.yml" "Configuration Docker"
check_file "Makefile" "Commandes make"
check_file "README.md" "Documentation principale"
check_file "AGENTS.md" "Utilisation IA"
check_file "CHANGELOG.md" "Historique versions"
check_file "conception.md" "Architecture"
check_file "benchmarks.md" "Comparaisons IA"
check_file "prompts.md" "Prompts utilisés"
check_file "install.sh" "Script installation"
check_file "GUIDE_COMPLET.md" "Guide complet"

echo ""
echo "🔧 Backend..."
echo ""

check_file "backend/package.json" "Dépendances backend"
check_file "backend/tsconfig.json" "Config TypeScript backend"
check_file "backend/Dockerfile" "Image Docker backend"
check_file "backend/init.sql" "Schéma base de données"
check_file "backend/src/app.ts" "Application principale"

echo ""
check_file "backend/src/api/routes/auth.routes.ts" "Routes auth"
check_file "backend/src/api/routes/chat.routes.ts" "Routes chat"
check_file "backend/src/api/routes/servers.routes.ts" "Routes serveurs"

echo ""
check_file "backend/src/services/ai/AIEngine.ts" "Moteur IA"
check_file "backend/src/services/auth/AuthService.ts" "Service auth"
check_file "backend/src/services/execution/SSHClient.ts" "Client SSH"

echo ""
check_file "backend/src/middleware/authentication.ts" "Middleware auth"
check_file "backend/src/middleware/errorHandler.ts" "Gestion erreurs"

echo ""
check_file "backend/src/types/models.ts" "Types TypeScript"
check_file "backend/src/config/database.ts" "Config DB"

echo ""
echo "🎨 Frontend..."
echo ""

check_file "frontend/package.json" "Dépendances frontend"
check_file "frontend/tsconfig.json" "Config TypeScript frontend"
check_file "frontend/Dockerfile" "Image Docker frontend"
check_file "frontend/nginx.conf" "Config Nginx"
check_file "frontend/tailwind.config.js" "Config Tailwind"
check_file "frontend/postcss.config.js" "Config PostCSS"

echo ""
check_file "frontend/public/index.html" "HTML principal"
check_file "frontend/src/index.tsx" "Point d'entrée React"
check_file "frontend/src/index.css" "Styles globaux"
check_file "frontend/src/App.tsx" "Composant App"

echo ""
check_file "frontend/src/components/ui/Button.tsx" "Composant Button"
check_file "frontend/src/components/ui/Input.tsx" "Composant Input"
check_file "frontend/src/components/ui/Card.tsx" "Composant Card"

echo ""
check_file "frontend/src/components/layout/Layout.tsx" "Layout principal"
check_file "frontend/src/components/layout/Header.tsx" "Header"
check_file "frontend/src/components/layout/Sidebar.tsx" "Sidebar"

echo ""
check_file "frontend/src/components/Chat/ChatInterface.tsx" "Interface chat"

echo ""
check_file "frontend/src/pages/Login.tsx" "Page login"
check_file "frontend/src/pages/Dashboard.tsx" "Page dashboard"
check_file "frontend/src/pages/Chat.tsx" "Page chat"
check_file "frontend/src/pages/Servers.tsx" "Page serveurs"

echo ""
echo "=============================================="
echo ""
echo "📊 RÉSUMÉ"
echo ""
echo -e "Total de fichiers vérifiés : ${BLUE}$total_files${NC}"
echo -e "Fichiers présents : ${GREEN}$present_files${NC}"
echo -e "Fichiers manquants : ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les fichiers sont présents ! Le projet est complet.${NC}"
    echo ""
    echo "🚀 Prochaines étapes :"
    echo "  1. Configurer .env avec votre clé API Anthropic"
    echo "  2. Lancer : make start"
    echo "  3. Accéder à http://localhost:3000"
    exit 0
else
    echo -e "${YELLOW}⚠️  Il manque $missing_files fichier(s).${NC}"
    echo ""
    echo "💡 Pour créer les fichiers manquants :"
    echo "  - Consultez GUIDE_COMPLET.md"
    echo "  - Utilisez les artifacts fournis"
    echo "  - Ou exécutez : ./install.sh"
    exit 1
fi