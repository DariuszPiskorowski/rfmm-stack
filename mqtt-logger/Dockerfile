FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY mqtt-logger.js .
CMD ["node", "mqtt-logger.js"]
