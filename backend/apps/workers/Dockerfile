FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
# Фікс: Якщо обривається мережа, жорстко видаляємо биті файли і качаємо начисто
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --no-fund --no-audit || \
    (echo "NPM Install failed, cleaning corrupted modules and retrying..." && rm -rf node_modules && npm cache clean --force && sleep 5 && npm install --no-fund --no-audit)
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
RUN npm run build:all

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
CMD ["sh", "-c", "node $(find dist -name main.js | head -n 1)"]