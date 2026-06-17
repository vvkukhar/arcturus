FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
RUN npm run build:all

FROM mcr.microsoft.com/playwright:v1.44.0-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/scrapers
CMD ["node", "dist/src/scraper-loop.js"]