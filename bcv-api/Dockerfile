FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production DB_PATH=/data/bcv.db PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY public ./public
COPY certs ./certs
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=60s --timeout=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "src/server.js"]
