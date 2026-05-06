#!/bin/sh

cd /app/apps/api && node dist/src/main.js &
cd /app/apps/workers && node dist/main.js &
cd /app/apps/scrapers && node dist/scraper-loop.js &

wait