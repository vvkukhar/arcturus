FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY apps/workers/package.json ./apps/workers/
COPY packages/db/prisma ./packages/db/prisma
RUN npm install
COPY . .
WORKDIR /app/packages/db
RUN npx prisma generate
WORKDIR /app/packages/shared
RUN npm run build
WORKDIR /app/apps/workers
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
CMD ["node", "dist/src/main.js"]