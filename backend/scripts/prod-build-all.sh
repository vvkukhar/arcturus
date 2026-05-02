#!/usr/bin/env bash
set -euo pipefail

echo "[prod-build-all] build docker stack"
docker compose build api workers

echo "[prod-build-all] done"