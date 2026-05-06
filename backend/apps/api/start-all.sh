#!/bin/sh

cd /backend/apps/api && node dist/src/main.js &
cd /backend/apps/workers && node dist/main.js &
cd /backend/apps/scrapers && node dist/scraper-loop.js &

wait