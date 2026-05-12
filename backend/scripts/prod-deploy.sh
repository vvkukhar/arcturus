#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] checking env"
npx tsx scripts/check-env.ts

echo "[deploy] pulling latest changes"
git pull origin main

echo "[deploy] building optimized docker stack"
docker compose -f docker-compose.prod.yml build

echo "[deploy] applying zero-downtime deployment"
docker compose -f docker-compose.prod.yml up -d --no-deps --build api workers scrapers

echo "[deploy] pruning old images"
docker image prune -f

echo "[deploy] waiting for API healthcheck"
sleep 10
curl -fsS http://127.0.0.1:4000/api/health | jq . || exit 1

echo "[deploy] successfully deployed to production"