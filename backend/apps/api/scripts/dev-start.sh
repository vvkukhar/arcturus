#!/usr/bin/env bash
set -euo pipefail

echo "[dev-start] checking env"
npx ts-node scripts/check-env.ts

echo "[dev-start] prisma generate"
npx prisma generate

echo "[dev-start] prisma db push"
npx prisma db push

echo "[dev-start] starting api"
npm run start:dev