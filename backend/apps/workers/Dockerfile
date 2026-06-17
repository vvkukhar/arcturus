FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
RUN npm install
RUN npm run build:all

FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/workers
# Шукаємо main.js динамічно
CMD ["sh", "-c", "node $(find ./dist -type f -name main.js | head -n 1)"]