# Arcturus Backend

Production-oriented backend for LEGO trading operations.

## Services

- `api` — NestJS HTTP + WebSocket API
- `workers` — BullMQ job processors
- `postgres` — main database
- `redis` — queue backend

## Local start

```bash
cd backend
docker compose up -d postgres redis

cd api
cp .env.example .env
npm install
npm run db:reset
npm run start:dev