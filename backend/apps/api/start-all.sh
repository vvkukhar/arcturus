#!/bin/sh
echo "Deploying database schema..."
cd /app/packages/db && npx prisma db push --accept-data-loss

echo "Starting API and Workers..."
cd /app/apps/api && node dist/src/main.js &
cd /app/apps/workers && node dist/main.js &
wait