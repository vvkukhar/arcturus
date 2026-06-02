#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting Zero-Downtime Deployment for Arcturus..."

docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml up -d --no-deps --build postgres redis
sleep 5

echo "🔄 Starting new API instance..."
docker compose -f docker-compose.prod.yml up -d --no-deps --scale api=2 --no-recreate api

echo "⏳ Waiting for new API to be healthy..."
sleep 15

echo "🛑 Stopping old API instance..."
docker rm -f $(docker ps -q --filter "name=arcturus_api" | head -n 1)

echo "🔄 Scaling API back to 1..."
docker compose -f docker-compose.prod.yml up -d --no-deps --scale api=1 --no-recreate api

echo "🔄 Updating Workers & Scrapers..."
docker compose -f docker-compose.prod.yml up -d --no-deps workers scrapers

echo "✅ Deployment Successful!"