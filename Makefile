# AiSystant - Makefile
# Commandes pratiques pour le développement et le déploiement

.PHONY: help install dev build start stop restart logs clean test

# Affiche l'aide
help:
	@echo "AiSystant - Commandes disponibles:"
	@echo ""
	@echo "  make install      - Installer toutes les dépendances"
	@echo "  make dev          - Lancer en mode développement"
	@echo "  make build        - Build les images Docker"
	@echo "  make start        - Démarrer tous les services"
	@echo "  make stop         - Arrêter tous les services"
	@echo "  make restart      - Redémarrer tous les services"
	@echo "  make logs         - Afficher les logs"
	@echo "  make clean        - Nettoyer les containers et volumes"
	@echo "  make test         - Lancer les tests"
	@echo "  make setup-env    - Créer le fichier .env depuis .env.example"
	@echo ""

# Setup initial
setup-env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Fichier .env créé depuis .env.example"; \
		echo "⚠️  N'oubliez pas de remplir les valeurs nécessaires !"; \
	else \
		echo "⚠️  Le fichier .env existe déjà"; \
	fi

# Installer les dépendances
install:
	@echo "📦 Installation des dépendances..."
	cd backend && npm install
	cd frontend && npm install
	@echo "✅ Dépendances installées"

# Mode développement (sans Docker)
dev:
	@echo "🚀 Démarrage en mode développement..."
	@make -j 2 dev-backend dev-frontend

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm start

# Build Docker
build:
	@echo "🔨 Build des images Docker..."
	docker-compose build
	@echo "✅ Images Docker buildées"

# Démarrer avec Docker
start:
	@echo "🚀 Démarrage de AiSystant..."
	docker-compose up -d
	@echo "✅ Services démarrés"
	@echo ""
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔧 Backend:  http://localhost:3001"
	@echo ""
	@make logs-follow

# Arrêter
stop:
	@echo "🛑 Arrêt des services..."
	docker-compose down
	@echo "✅ Services arrêtés"

# Redémarrer
restart:
	@make stop
	@make start

# Logs
logs:
	docker-compose logs

logs-follow:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Nettoyer
clean:
	@echo "🧹 Nettoyage..."
	docker-compose down -v
	rm -rf backend/dist
	rm -rf frontend/build
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
	@echo "✅ Nettoyage terminé"

# Tests
test:
	@echo "🧪 Lancement des tests..."
	cd backend && npm test
	cd frontend && npm test
	@echo "✅ Tests terminés"

test-backend:
	cd backend && npm test

test-frontend:
	cd frontend && npm test

test-coverage:
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage

# Base de données
db-migrate:
	cd backend && npm run migrate

db-seed:
	cd backend && npm run seed

db-reset:
	cd backend && npm run db:reset

# Linting
lint:
	cd backend && npm run lint
	cd frontend && npm run lint

lint-fix:
	cd backend && npm run lint:fix
	cd frontend && npm run lint:fix

# Production
prod-build:
	@echo "🏗️  Build pour production..."
	docker-compose -f docker-compose.yml build
	@echo "✅ Build production terminé"

prod-start:
	@echo "🚀 Démarrage en production..."
	docker-compose -f docker-compose.yml up -d
	@echo "✅ Production démarrée"

# Backup
backup:
	@echo "💾 Backup de la base de données..."
	docker exec aisystant-db pg_dump -U aisystant aisystant > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup créé"

# Monitoring
health:
	@echo "🏥 Vérification de l'état des services..."
	@curl -s http://localhost:3001/health || echo "❌ Backend down"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend up" || echo "❌ Frontend down"

# Stats Docker
stats:
	docker stats aisystant-backend aisystant-frontend aisystant-db aisystant-redis

# Shell dans les containers
shell-backend:
	docker exec -it aisystant-backend sh

shell-frontend:
	docker exec -it aisystant-frontend sh

shell-db:
	docker exec -it aisystant-db psql -U aisystant

shell-redis:
	docker exec -it aisystant-redis redis-cli