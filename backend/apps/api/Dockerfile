FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
# Копіюємо все і збираємо монорепу повністю, як локально
COPY . .
RUN npm install
RUN npm run build:all

FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/api
EXPOSE 4000
# Шукаємо main.js динамічно в папці dist
CMD ["sh", "-c", "npx prisma db push --schema=../../packages/db/prisma/schema.prisma --accept-data-loss && node $(find ./dist -type f -name main.js | head -n 1)"]