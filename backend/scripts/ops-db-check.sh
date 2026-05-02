#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://127.0.0.1:4000/api}"
TOKEN="${ADMIN_TOKEN:-supersecret}"

curl -fsS "$API_URL/metrics/db" \
  -H "Authorization: Bearer $TOKEN" | jq .