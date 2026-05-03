FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
# Копіюємо всі package.json з підпапок, щоб закешувати депси
COPY api/package.json ./api/
COPY workers/package.json ./workers/
COPY scrapers/package.json ./scrapers/

# Встановлюємо залежності для всього монорепозиторію
RUN npm install

COPY . .

# Збираємо по черзі, очищуючи кеш npm після кожного кроку для економії RAM
WORKDIR /app/api
RUN npx prisma generate && npm run build

WORKDIR /app/workers
RUN npx prisma generate && npm run build

WORKDIR /app/scrapers
RUN npx prisma generate && npm run build

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=builder /app /app

WORKDIR /app/api
RUN chmod +x start-all.sh

EXPOSE 4000

CMD ["./start-all.sh"]