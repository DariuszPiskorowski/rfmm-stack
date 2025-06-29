FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY watcher.js .
CMD ["node", "watcher.js"]
