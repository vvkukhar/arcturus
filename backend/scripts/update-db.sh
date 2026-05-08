#!/usr/bin/env bash
set -e

cd packages/db
npx prisma generate
npx prisma db push