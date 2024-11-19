FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production image
FROM node:20-slim

WORKDIR /app

# Install production dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy built frontend and backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/server ./src/server

# Create directory for data persistence
RUN mkdir -p /data/vectors

# Environment variables
ENV NODE_ENV=production
ENV VECTORS_PATH=/data/vectors
ENV PORT=3000

# Expose ports
EXPOSE 3000
EXPOSE 8080

# Start command
CMD ["npm", "run", "start:prod"]