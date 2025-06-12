# Base OS
FROM ubuntu:20.04

# Disable interactive prompts during package installs
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sudo \
    curl \
    git \
    gnupg \
    wget \
    dpkg \
    libssl1.1 \
    libevent-2.1-7 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    xvfb \
    --no-install-recommends

# Install Chrome
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install && \
    rm google-chrome-stable_current_amd64.deb

# Create working directory
WORKDIR /app

# Copy your app
COPY . .

# Install Node.js and dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install

# Optional: set default shell to bash
SHELL ["/bin/bash", "-c"]

# Start the bot script
CMD ["node", "index.js"]
