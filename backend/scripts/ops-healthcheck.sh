#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://127.0.0.1:4000/api}"

echo "[ops] health"
curl -fsS "$API_URL/health" | jq . || curl -fsS "$API_URL/health"

echo ""
echo "[ops] prometheus metrics sample"
curl -fsS "$API_URL/metrics/prometheus" | head -n 30