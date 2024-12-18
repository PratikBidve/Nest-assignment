# Use a lightweight Node.js image for better efficiency
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application source code
COPY . .

# Build the app
RUN npm run build

# Use another lightweight Node.js image for the final container
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy built files and node_modules from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the application port
EXPOSE 3000

# Set the environment variable
ENV NODE_ENV=production
ENV JWT_SECRET=your_jwt_secret_key

# Start the application
CMD ["node", "dist/main"]
