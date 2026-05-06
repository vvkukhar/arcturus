#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
FILE="$BACKUP_DIR/arcturus_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

pg_dump "$DATABASE_URL" > "$FILE"

echo "Backup created: $FILE"