FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

# Копіюємо package.json з усіх модулів
COPY api/package.json ./api/
COPY workers/package.json ./workers/
COPY scrapers/package.json ./scrapers/
# Копіюємо кореневий package.json (якщо він є у папці backend)
COPY package.json package-lock.json* ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код
COPY . .

# Збираємо API
WORKDIR /app/api
RUN npx prisma generate && npm run build

# Збираємо Workers
WORKDIR /app/workers
RUN npx prisma generate && npm run build

# Збираємо Scrapers
WORKDIR /app/scrapers
# Якщо в scrapers немає build скрипта, просто генеруємо клієнт
RUN npx prisma generate

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=builder /app /app

# Важливо: скрипт запуску тепер має бути доступним
WORKDIR /app/api
RUN chmod +x start-all.sh

EXPOSE 4000

CMD ["./start-all.sh"]