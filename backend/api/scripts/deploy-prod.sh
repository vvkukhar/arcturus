#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] checking env"
npx tsx scripts/check-env.ts

echo "[deploy] building api image"
docker compose -f docker-compose.prod.yml build api

echo "[deploy] starting services"
docker compose -f docker-compose.prod.yml up -d

echo "[deploy] waiting for api"
sleep 8

echo "[deploy] health check"
npx tsx scripts/prod-health-check.ts

echo "[deploy] done"