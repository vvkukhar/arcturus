FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

# 🔥 ФІКС: компілюємо пакет БД перед спільним кодом
WORKDIR /app/packages/db
RUN npm run build

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/apps/scrapers
RUN npx tsc -p tsconfig.json

FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/scrapers
CMD ["sh", "-c", "node $(find dist -name scraper-loop.js | head -n 1)"]