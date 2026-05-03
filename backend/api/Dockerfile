FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

# Ми тепер "дивимось" з папки backend, тому шляхи такі:
COPY api/package.json ./api/
COPY workers/package.json ./workers/
COPY scrapers/package.json ./scrapers/
COPY package.json package-lock.json* ./

RUN npm install

# Копіюємо все з папки backend
COPY . .

# Білдимо API
WORKDIR /app/api
RUN npx prisma generate && npm run build

# Білдимо Workers
WORKDIR /app/workers
RUN npx prisma generate && npm run build

# Scrapers
WORKDIR /app/scrapers
RUN npx prisma generate

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=builder /app /app

# Запуск
WORKDIR /app/api
RUN chmod +x start-all.sh
EXPOSE 4000
CMD ["./start-all.sh"]