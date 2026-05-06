FROM node:22-alpine AS builder
WORKDIR /backend
RUN apk add --no-cache openssl

COPY . .

RUN npm install

WORKDIR /backend/packages/db
RUN npx prisma generate
RUN npm run build

WORKDIR /backend/packages/shared
RUN npm run build

WORKDIR /backend/apps/api
RUN npm run build

WORKDIR /backend/apps/workers
RUN npm run build

WORKDIR /backend/apps/scrapers
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /backend
RUN apk add --no-cache openssl

COPY --from=builder /backend /backend

WORKDIR /backend/apps/api
RUN chmod +x start-all.sh

EXPOSE 4000

CMD ["./start-all.sh"]