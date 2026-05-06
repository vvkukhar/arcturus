FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY . .

RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate
RUN npm run build

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

WORKDIR /app/apps/workers
RUN npx prisma generate
RUN npm run build

WORKDIR /app/apps/scrapers
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=builder /app /app

WORKDIR /app/apps/api
RUN chmod +x start-all.sh

EXPOSE 4000

CMD ["./start-all.sh"]