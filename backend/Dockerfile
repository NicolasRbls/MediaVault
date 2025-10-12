# Stage 1: Build
FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Production
FROM node:18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

# Ensure the database path is in a persistent volume
ENV DATABASE_PATH=/var/data/mediavault.db

# Expose port
EXPOSE 5000

CMD ["node", "src/server.js"]
