#!/usr/bin/env bash
set -euo pipefail

echo "[prod-redeploy] pulling latest git changes if repo is attached"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git pull --ff-only
fi

echo "[prod-redeploy] rebuilding api/workers"
docker compose -f docker-compose.prod.yml build api workers

echo "[prod-redeploy] restarting"
docker compose -f docker-compose.prod.yml up -d api workers

echo "[prod-redeploy] health"
sleep 5
curl -fsS http://127.0.0.1:4000/api/health | jq . || curl -fsS http://127.0.0.1:4000/api/health