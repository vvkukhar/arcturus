FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

# 🔥 ФІКС: компілюємо пакет БД перед спільним кодом
WORKDIR /app/packages/db
RUN npm run build

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/apps/workers
RUN npx tsc -p tsconfig.json

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
CMD ["sh", "-c", "node $(find dist -name main.js | head -n 1)"]