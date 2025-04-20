# Stage 1: Build the app (Builder image)
FROM node:22.12.0 AS builder
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --force

# Copy the rest of the application files
COPY . .

# Build the application (compile TypeScript)
RUN npm run build

# Stage 2: Production image
FROM node:22.12.0 AS prod
WORKDIR /app

# Copy only the package.json files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --force

# Copy compiled build output and other necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Make the start script executable
RUN chmod +x ./scripts/start.sh

# Set environment variables
ENV NODE_ENV=production
EXPOSE 8080

# Use the shell script to automate DB creation, and app start
CMD ["sh", "./scripts/start.sh"]
