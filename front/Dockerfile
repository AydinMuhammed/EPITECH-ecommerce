# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Build the Next.js app for production
RUN npm run build

# Debugging: Check the contents of the .next directory
RUN ls -la .next

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js server in production mode
CMD ["npm", "run", "start"]