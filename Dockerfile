FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev deps for building)
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Second stage: runtime
FROM node:20-alpine

# Install base packages for MCP servers requiring uvx
RUN apk add --no-cache python3 py3-uv make g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port (using the default port from src/index.ts)
EXPOSE 3000

# Start the application using the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
