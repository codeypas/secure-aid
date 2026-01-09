# Stage 1: Build the TypeScript code
FROM node:18 AS builder

WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the codebase
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production image
FROM node:18-slim

WORKDIR /app

# Only copy necessary files from build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your email server uses
EXPOSE 3001

# Command to run the compiled server
CMD ["node", "dist/index.js"]
