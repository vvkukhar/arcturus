#!/usr/bin/env bash
set -euo pipefail

if [ ! -f ".env.production" ]; then
  echo "[prod-init] copying .env.production.example"
  cp .env.production.example .env.production
  echo "[prod-init] edit .env.production before running production"
  exit 1
fi

mkdir -p backups

echo "[prod-init] build images"
docker compose -f docker-compose.prod.yml build

echo "[prod-init] starting database and redis"
docker compose -f docker-compose.prod.yml up -d postgres redis

echo "[prod-init] starting api and workers"
docker compose -f docker-compose.prod.yml up -d api workers

echo "[prod-init] status"
docker compose -f docker-compose.prod.yml ps