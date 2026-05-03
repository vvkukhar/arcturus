#!/bin/sh

# 1. Запускаємо API у фоновому режимі
echo "Starting API..."
node dist/src/main.js &

# 2. Переходимо у папку воркерів, білдимо та запускаємо у фоні
# Ми використовуємо локальні файли, які вже завантажені на Render
echo "Starting Workers..."
cd ../workers && node dist/main.js &

# 3. Запускаємо скрейпери в циклі
echo "Starting Scraper Loop..."
cd ../scrapers && node dist/scraper-loop.js