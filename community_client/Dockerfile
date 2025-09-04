# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose new port (3001 instead of 3000)
EXPOSE 3001

# Start Next.js on port 3001
CMD ["npm", "run", "dev", "--", "-p", "3001"]

