FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS builder
WORKDIR /app
COPY . .
# Фікс для обриву мережі під час білду
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --no-fund --no-audit || \
    (sleep 5 && npm install --no-fund --no-audit)
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
RUN npm run build:all

FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app

# 🔥 ФІКС PLAYWRIGHT: Докачуємо правильну версію Chromium для нашої версії бібліотеки
RUN npx playwright install chromium

WORKDIR /app/apps/scrapers
CMD ["sh", "-c", "node $(find dist -name scraper-loop.js | head -n 1)"]