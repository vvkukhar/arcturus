#!/bin/sh
echo "Starting Triple-Engine Monolith..."

# Запуск API
node dist/src/main.js &

# Запуск Workers
cd ../workers && node dist/main.js &

# Запуск Scrapers
cd ../scrapers && node dist/scraper-loop.js