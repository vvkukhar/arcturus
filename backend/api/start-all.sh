#!/bin/sh
echo "Triple-Engine Online"
node /app/api/dist/src/main.js &
node /app/workers/dist/main.js &
node /app/scrapers/dist/scraper-loop.js