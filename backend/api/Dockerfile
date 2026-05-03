# Спільна база для всіх
FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

# Копіюємо весь backend (включаючи api, workers, scrapers)
COPY . .

# Збираємо API
WORKDIR /app/api
RUN npm install && npm run build && npx prisma generate

# Збираємо Workers
WORKDIR /app/workers
RUN npm install && npm run build && npx prisma generate

# Збираємо Scrapers
WORKDIR /app/scrapers
RUN npm install && npm run build && npx prisma generate

# Фінальний образ
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

# Копіюємо зібрані дистрибутиви
COPY --from=builder /app /app

# Даємо права на виконання скрипту запуску
WORKDIR /app/api
RUN chmod +x start-all.sh

EXPOSE 4000

# Запускаємо наш "комбайн"
CMD ["./start-all.sh"]