#!/bin/sh
echo "Starting Triple-Engine Monolith..."

# Запуск API
cd /app/api && node dist/src/main.js &

# Запуск Workers
cd /app/workers && node dist/main.js &

# Запуск Scrapers (цикл)
cd /app/scrapers && node dist/scraper-loop.js