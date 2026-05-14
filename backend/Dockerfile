FROM node:22-alpine

WORKDIR /backend

RUN apk add --no-cache openssl curl

COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/
COPY apps/workers/package*.json ./apps/workers/
COPY apps/scrapers/package*.json ./apps/scrapers/

COPY packages/db/prisma ./packages/db/prisma

RUN npm install

COPY . .

RUN npm run build:all

CMD ["sh", "-c", "node $(find . -type f -name main.js -not -path '*/node_modules/*' | grep api | grep dist | head -n 1)"]