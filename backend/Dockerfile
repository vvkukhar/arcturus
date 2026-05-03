FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

# Копіюємо весь контент backend
COPY . .

# 1. Готуємо API
WORKDIR /app/api
RUN npm install && npx prisma generate && npm run build

# 2. Готуємо Workers
WORKDIR /app/workers
RUN npm install && npx prisma generate && npm run build

# 3. Готуємо Scrapers (Додано npm run build)
WORKDIR /app/scrapers
RUN npm install && npx prisma generate && npm run build

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

# Копіюємо все готове з етапу builder
COPY --from=builder /app /app

# Надаємо права на скрипт запуску
WORKDIR /app/api
RUN chmod +x start-all.sh

EXPOSE 4000

# Запускаємо наш комбайн через менеджер процесів
CMD ["./start-all.sh"]