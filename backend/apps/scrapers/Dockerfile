FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:all

FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/scrapers
# Шукаємо scraper-loop.js динамічно
CMD ["sh", "-c", "node $(find ./dist -type f -name scraper-loop.js | head -n 1)"]