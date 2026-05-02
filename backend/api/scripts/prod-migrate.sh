#!/usr/bin/env bash
set -euo pipefail

echo "[prod-migrate] generate prisma"
npx prisma generate

echo "[prod-migrate] deploy migrations"
npx prisma migrate deploy

echo "[prod-migrate] done"