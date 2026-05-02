#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"

if [ -z "$FILE" ]; then
  echo "Usage: ./scripts/db-restore.sh <backup.sql>"
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

psql "$DATABASE_URL" < "$FILE"

echo "Restore completed from: $FILE"