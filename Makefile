# Variables
DOCKER_DEV_COMPOSE = docker compose -f docker-compose.dev.yml
DOCKER_PROD_COMPOSE = docker compose -f docker-compose.prod.yml

# Default target
.DEFAULT_GOAL := help

## 💡 Show available commands
help:
	@echo "🚀 API Gateway Makefile Commands:"
	@echo "--------------------------------------"
	@echo "make build-dev         -> Build the development container"
	@echo "make up-dev            -> Start the development container"
	@echo "make down-dev          -> Stop the development container"
	@echo "make logs-dev          -> Show development logs"
	@echo "make restart-dev       -> Restart the development container"
	@echo ""
	@echo "make build-prod        -> Build the production container"
	@echo "make up-prod           -> Start the production container"
	@echo "make down-prod         -> Stop the production container"
	@echo "make logs-prod         -> Show production logs"
	@echo "make restart-prod      -> Restart the production container"


## 🔧 Development Mode
build-dev: ## Build the development container
	$(DOCKER_DEV_COMPOSE) build

up-dev: ## Start the development container
	$(DOCKER_DEV_COMPOSE) up --build

down-dev: ## Stop the development container
	$(DOCKER_DEV_COMPOSE) down

logs-dev: ## Show development logs
	$(DOCKER_DEV_COMPOSE) logs -f

restart-dev: ## Restart the development container
	$(DOCKER_DEV_COMPOSE) down && $(DOCKER_DEV_COMPOSE) up --build

## 🚀 Production Mode
build-prod: ## Build the production container
	$(DOCKER_PROD_COMPOSE) build

up-prod: ## Start the production container
	$(DOCKER_PROD_COMPOSE) up --build -d

down-prod: ## Stop the production container
	$(DOCKER_PROD_COMPOSE) down

logs-prod: ## Show production logs
	$(DOCKER_PROD_COMPOSE) logs -f

restart-prod: ## Restart the production container
	$(DOCKER_PROD_COMPOSE) down && $(DOCKER_PROD_COMPOSE) up --build -d