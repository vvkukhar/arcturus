#!/bin/sh
echo "Starting Triple-Engine Monolith: API, Workers, and Scrapers..."

# 1. Запуск API у фоновому режимі
cd /app/api && node dist/src/main.js &

# 2. Запуск Workers у фоновому режимі
cd /app/workers && node dist/main.js &

# 3. Запуск Scrapers у фоновому режимі (цикл)
# Тепер запускаємо з dist, оскільки ми додали build у Dockerfile
cd /app/scrapers && node dist/scraper-loop.js &

# Очікуємо, щоб контейнер не завершувався
wait