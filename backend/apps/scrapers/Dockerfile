FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY apps/scrapers/package.json ./apps/scrapers/
COPY packages/db/prisma ./packages/db/prisma
RUN npm install
COPY . .
WORKDIR /app/packages/db
RUN npx prisma generate
WORKDIR /app/packages/shared
RUN npm run build
WORKDIR /app/apps/scrapers
RUN npm run build

FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/scrapers
CMD ["node", "dist/scraper-loop.js"]