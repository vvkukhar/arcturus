#!/usr/bin/env bash
set -euo pipefail

echo "[full-local-check] starting postgres + redis"
docker compose up -d postgres redis

echo "[full-local-check] api install/build"
cd api
npm install
npm run env:check
npm run prisma:generate
npm run prisma:push
npm run seed
npm run build
npm run openapi:export
cd ..

echo "[full-local-check] workers install/build"
cd workers
npm install
npm run prisma:generate
npm run build
cd ..

echo "[full-local-check] done"