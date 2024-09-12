# Use Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port 3000 (default for Vite)
EXPOSE 3000

# Run Vite development server
CMD ["npm", "run", "dev"]
