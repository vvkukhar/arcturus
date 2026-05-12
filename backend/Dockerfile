FROM node:22-alpine AS builder
WORKDIR /backend
RUN apk add --no-cache openssl

COPY package*.json ./
COPY packages/db/package*.json ./packages/db/
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/
COPY apps/workers/package*.json ./apps/workers/
COPY apps/scrapers/package*.json ./apps/scrapers/

RUN npm ci

COPY . .

RUN npm run db:generate
RUN npm run build:all

FROM node:22-alpine AS runner
WORKDIR /backend
RUN apk add --no-cache openssl curl

ENV NODE_ENV=production

COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder /backend/packages/db/dist ./packages/db/dist
COPY --from=builder /backend/packages/db/prisma ./prisma
COPY --from=builder /backend/packages/shared/dist ./packages/shared/dist
COPY --from=builder /backend/apps/api/dist ./apps/api/dist
COPY --from=builder /backend/apps/workers/dist ./apps/workers/dist
COPY --from=builder /backend/apps/scrapers/dist ./apps/scrapers/dist
COPY --from=builder /backend/package*.json ./

RUN npm prune --production

EXPOSE 4000