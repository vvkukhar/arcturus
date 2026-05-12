FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY apps/api/package.json ./apps/api/
COPY apps/workers/package.json ./apps/workers/
COPY apps/scrapers/package.json ./apps/scrapers/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
WORKDIR /app/packages/db
RUN npx prisma generate
WORKDIR /app/packages/shared
RUN npm run build
WORKDIR /app/apps/api
RUN npm run build
WORKDIR /app/apps/workers
RUN npm run build
WORKDIR /app/apps/scrapers
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/api
RUN chmod +x start-all.sh
EXPOSE 4000
CMD ["./start-all.sh"]