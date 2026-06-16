FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY packages/db/prisma ./packages/db/prisma
RUN npm install
COPY . .
WORKDIR /app/packages/db
RUN npx prisma generate
WORKDIR /app/packages/shared
RUN npm run build
WORKDIR /app/apps/api
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy --schema=../../packages/db/prisma/schema.prisma && node dist/src/main.js"]