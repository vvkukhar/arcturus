#!/usr/bin/env bash
set -euo pipefail

docker compose -f docker-compose.prod.yml ps

echo ""
echo "[health]"
curl -fsS http://127.0.0.1:4000/api/health | jq . || curl -fsS http://127.0.0.1:4000/api/health