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

RUN npm ci

COPY . .

RUN npm run build:all

CMD ["node", "dist/apps/api/main.js"]