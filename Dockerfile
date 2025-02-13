# Gunakan Node.js versi terbaru sebagai base image
FROM node:20-alpine

# Set workdir
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# ARG NODE_ENV mode (default: development)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies based mode
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

# Copy all
COPY . .

# Expose port
ARG EXPOSE_PORT=3000
ENV EXPOSE_PORT=${EXPOSE_PORT:-3000}

# CMD will replace in docker-compose
CMD ["node", "server.js", "--port", "$EXPOSE_PORT"]
