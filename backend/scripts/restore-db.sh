#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.production}"
BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: bash scripts/restore-db.sh backups/arcturus_YYYYMMDD_HHMMSS.sql.gz"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "[restore-db] missing env file: $ENV_FILE"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "[restore-db] backup file not found: $BACKUP_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

echo "[restore-db] stopping api/workers"
docker compose -f docker-compose.prod.yml stop api workers

echo "[restore-db] dropping and recreating db"
docker exec arcturus_postgres psql -U "${POSTGRES_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${POSTGRES_DB};"
docker exec arcturus_postgres psql -U "${POSTGRES_USER}" -d postgres -c "CREATE DATABASE ${POSTGRES_DB};"

echo "[restore-db] restoring $BACKUP_FILE"
gunzip -c "$BACKUP_FILE" | docker exec -i arcturus_postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"

echo "[restore-db] starting api/workers"
docker compose -f docker-compose.prod.yml up -d api workers

echo "[restore-db] done"