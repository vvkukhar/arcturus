#!/usr/bin/env bash
set -euo pipefail

echo "[reset-dev-db] generate prisma"
npx prisma generate

echo "[reset-dev-db] push schema"
npx prisma db push --force-reset

echo "[reset-dev-db] seed"
npm run seed

echo "[reset-dev-db] done"