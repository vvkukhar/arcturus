FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
# Збираємо весь монорепозиторій однією командою
RUN npm run build:all

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
CMD ["sh", "-c", "node $(find dist -name main.js | head -n 1)"]