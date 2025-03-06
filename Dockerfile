# Base image
FROM node:20-alpine as base

# Set Workdir
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy all (exclude by .dockerignore) to /home/node/app
COPY . .

# Install all dependencies
RUN npm install -g npm@latest && npm install

# * 
# * ============= Dev Image Setup =============
# * 
FROM base as development
RUN npm install -g nodemon

# Set Non Root User
USER node

# Set permissions to node:node
COPY --chown=node:node . .

# * 
# * ============= Prod Image Setup =============
# * 
FROM base as production
RUN npm install -g pm2


# Set Non Root User
USER node

# Set permissions to node:node
COPY --chown=node:node . .

# Start single instances using pm2
CMD ["pm2-runtime", "bin/www"]
