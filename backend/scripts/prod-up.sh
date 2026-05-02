#!/usr/bin/env bash
set -euo pipefail

echo "[prod-up] starting stack"
docker compose up -d postgres redis api workers

echo "[prod-up] status"
docker compose ps