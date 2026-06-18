FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

# Компілюємо всі залежні воркспейси монорепозиторію
RUN npm run build:shared
RUN npm run build:db
RUN npm run build:scrapers

# Компілюємо самих воркерів
WORKDIR /app/apps/workers
RUN npx tsc -p tsconfig.json

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
CMD ["sh", "-c", "echo '=== 🔍 DEBUG WORKERS: DIST FOLDER ===' && find dist && echo '=== 🚀 STARTING WORKER ===' && FILE=$(find dist -name main.js | head -n 1) && echo \"Executing: node $FILE\" && node $FILE || (echo '❌ WORKER CRASHED (See error above) ❌' && sleep 600)"]