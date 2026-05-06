# Arcturus API

Backend for Arcturus LEGO trading system.

## Stack

- NestJS
- Prisma
- PostgreSQL
- Redis / BullMQ
- JWT auth
- Socket.IO realtime
- Docker

## Local setup

```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev