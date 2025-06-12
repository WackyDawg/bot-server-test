FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV NODE_ENV=production
# Pass BOT_CONFIG as an environment variable or mount the config file
CMD ["node", "bot-instance.js"]