FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY . .
RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma
WORKDIR /app/packages/shared
RUN npm run build
WORKDIR /app/apps/api
RUN npx nest build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --schema=../../packages/db/prisma/schema.prisma --accept-data-loss && node $(find dist -name main.js | head -n 1)"]