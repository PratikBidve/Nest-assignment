# Use an official Node.js runtime as a parent image
FROM node:16 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Use a smaller Node.js image for the final container
FROM node:16-slim

WORKDIR /app

# Copy only the necessary files from the builder image
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/

# Expose the port your app will run on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]
