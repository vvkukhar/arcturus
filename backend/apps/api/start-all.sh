#!/bin/sh
cd /app/apps/api && node dist/src/main.js &
cd /app/apps/workers && node dist/main.js &
wait