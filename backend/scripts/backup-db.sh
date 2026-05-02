#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.production}"

if [ ! -f "$ENV_FILE" ]; then
  echo "[backup-db] missing env file: $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP_FILE="${BACKUP_DIR}/arcturus_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[backup-db] writing $BACKUP_FILE"

docker exec arcturus_postgres pg_dump \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  --no-owner \
  --no-privileges \
  | gzip > "$BACKUP_FILE"

echo "[backup-db] done"