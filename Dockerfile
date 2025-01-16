# Dockerfile

# Base image for Ubuntu 22.04
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install dependencies and MongoDB
RUN apt-get update && apt-get install -y zip unzip gnupg curl \
    && curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list \
    && apt-get update && apt-get install -y mongodb-org \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && export BUN_INSTALL="$HOME/.bun" \
    && export PATH="$BUN_INSTALL/bin:$PATH"

# Set MongoDB data directory
VOLUME ["/data/db"]

# Copy package files and install dependencies
COPY package.json bun.lockb tsconfig.json ./
RUN $HOME/.bun/bin/bun install

# Copy application files
COPY src ./src

# Expose the application port
EXPOSE 3100

# Start MongoDB and the application
CMD mongod --dbpath /data/db --logpath /var/log/mongodb.log --fork && $HOME/.bun/bin/bun run src/index.ts
