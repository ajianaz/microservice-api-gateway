# 🚀 API Gateway with Fastify

This is a **lightweight and high-performance API Gateway** built using **Fastify**. It acts as a central entry point for routing requests to multiple microservices while handling authentication, access control, rate limiting, and logging.

## 🔥 Features

- **🚀 Fast and Lightweight** - Uses **Fastify** for high-performance request handling.
- **🔐 Authentication** - Supports authentication via **Keycloak**.
- **🛡️ Access Control** - Manages access permissions using **API Manager Service**.
- **📡 Microservices Proxy** - Dynamically routes requests to backend microservices.
- **📈 Rate Limiting** - Prevents abuse by limiting requests per client.
- **📝 Logging & Monitoring** - Uses built-in **Fastify logger** for structured logging.
- **🔌 Modular & Extensible** - Easy to extend and maintain with a modular architecture.
- **🐳 Docker Support** - Includes **Dockerfile** and **Docker Compose** for development and production.

## 📂 Project Structure

```
📦 api-gateway 
├── 📂 src
│ ├── 📂 config
│ │ ├── services.json # Json of Services
│ ├── 📂 middlewares
│ │ ├── AccessMiddleware.js # Handles API access control 
│ │ ├── AuthMiddleware.js # Handles authentication (Keycloak) 
│ │ ├── ProxyMiddleware.js # Handles Forward to Target Service 
│ ├── 📂 services 
│ │ ├── ApiManager.js # API Manager for Access Controll
│ │ ├── ServiceManager.js # Service Manager for Service Discovery
│ ├── 📂 utils 
│ │ ├── RateLimiter.js # Implements rate limiting 
│ │ ├── ResponseHelper.js # Helper Response
├── .env.local # Environment variables for development 
├── .env.prod # Environment variables for production 
├── Dockerfile # Dockerfile for production and development by NODE_ENV
├── docker-compose.dev.yml # Docker Compose for development 
├── docker-compose.prod.yml # Docker Compose for production 
├── Makefile # Automates common tasks 
├── server.js # Main Fastify server 
└── package.json
```

# Project dependencies

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/azfirazka/api-gateway.git
cd api-gateway
```

### 2️⃣ **Install Dependencies**
```
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a ```.env.local``` file for development and a ```.env.prod``` file for production:

.env.local (Development)
```
PORT=3000
HOST:0.0.0.0
LOGGER=true
```

.env.prod (Production)
```
PORT=3000
HOST:0.0.0.0
LOGGER=true
```

### 4️⃣ **Run in Development Mode**
```
npm run dev
```
OR using Docker Compose:
```
make up-dev
```

### 5️⃣ **Run in Production Mode**
```
npm start
```
OR using Docker Compose:
```
make up-prod
```

## How to Use the Makefile

### 🚀 For Development
```
make build-dev        # Build the development container
make up-dev           # Start the development container
make down-dev         # Stop the development container
make logs-dev         # Show development logs
make restart-dev      # Restart the development container
```

### 🚀 For Production
```
make build-prod       # Build the production container
make up-prod          # Start the production container
make down-prod        # Stop the production container
make logs-prod        # Show production logs
make restart-prod     # Restart the production container
```

---
