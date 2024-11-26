# Use the official Node.js 18 image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if present) to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the project (assuming you have a build script in your package.json)
RUN npm run build

# Expose the port the app will run on (change this if necessary)
EXPOSE 8080

# Start the app (adjust if you use a different start command)
CMD ["npm", "start"]

