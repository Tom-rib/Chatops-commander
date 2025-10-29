#!/bin/bash

# AiSystant - Installation Complète pour Debian 12
# Ce script installe TOUT ce dont vous avez besoin

set -e

echo "🚀 AiSystant - Installation sur Debian 12"
echo "=================================================="
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

# Vérifier que le script est exécuté sur Debian
if [ ! -f /etc/debian_version ]; then
    print_error "Ce script est conçu pour Debian uniquement"
fi

print_info "Version Debian détectée : $(cat /etc/debian_version)"
echo ""

# ============================================
# ÉTAPE 1 : MISE À JOUR DU SYSTÈME
# ============================================
echo "📦 Étape 1/6 : Mise à jour du système..."
sudo apt update
sudo apt upgrade -y
print_success "Système mis à jour"
echo ""

# ============================================
# ÉTAPE 2 : OUTILS DE BASE
# ============================================
echo "🔧 Étape 2/6 : Installation des outils de base..."
sudo apt install -y \
    curl \
    wget \
    git \
    nano \
    vim \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https

print_success "Outils de base installés"
echo ""

# ============================================
# ÉTAPE 3 : DOCKER & DOCKER COMPOSE
# ============================================
echo "🐳 Étape 3/6 : Installation de Docker..."

# Supprimer les anciennes versions
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Ajouter la clé GPG officielle de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Ajouter le repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

print_success "Docker installé"
echo ""

# ============================================
# ÉTAPE 4 : DOCKER COMPOSE (version standalone)
# ============================================
echo "🐙 Étape 4/6 : Installation de Docker Compose..."

DOCKER_COMPOSE_VERSION="v2.24.5"
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Créer un lien symbolique pour 'docker compose' (sans tiret)
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

print_success "Docker Compose installé"
echo ""

# ============================================
# ÉTAPE 5 : NODE.JS 20 LTS
# ============================================
echo "📦 Étape 5/6 : Installation de Node.js 20 LTS..."

# Ajouter le repository NodeSource pour Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Installer Node.js
sudo apt install -y nodejs

print_success "Node.js installé"
echo ""

# ============================================
# ÉTAPE 6 : CONFIGURATION FINALE
# ============================================
echo "⚙️ Étape 6/6 : Configuration finale..."

# Activer Docker au démarrage
sudo systemctl enable docker
sudo systemctl start docker

# Créer un dossier pour les projets
mkdir -p ~/projets

print_success "Configuration terminée"
echo ""

# ============================================
# VÉRIFICATIONS
# ============================================
echo "✅ Vérification des installations..."
echo ""

echo "Docker version:"
docker --version

echo ""
echo "Docker Compose version:"
docker-compose --version

echo ""
echo "Node.js version:"
node --version

echo ""
echo "npm version:"
npm --version

echo ""
echo "Git version:"
git --version

echo ""
echo "======================================================"
echo ""
print_success "🎉 Installation terminée avec succès !"
echo ""
echo "⚠️  IMPORTANT : Vous devez redémarrer votre session"
echo "   pour que les permissions Docker soient appliquées"
echo ""
echo "   Tapez : exit"
echo "   Puis reconnectez-vous"
echo ""
echo "======================================================"
echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo ""
echo "1. Redémarrer la session (exit puis reconnexion)"
echo ""
echo "2. Cloner le projet :"
echo "   cd ~/projets"
echo "   git clone https://github.com/VOTRE-NOM/aisystant.git"
echo "   cd aisystant"
echo ""
echo "3. Configurer l'environnement :"
echo "   cp .env.example .env"
echo "   nano .env"
echo "   # Modifier ANTHROPIC_API_KEY"
echo ""
echo "4. Installer et démarrer :"
echo "   ./install.sh"
echo "   make start"
echo ""
echo "5. Accéder à l'application :"
echo "   http://localhost:3000"
echo ""
print_success "Bonne installation ! 🚀"