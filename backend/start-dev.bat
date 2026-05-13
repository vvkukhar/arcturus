@echo off
start "API" powershell -NoExit -Command "npm run dev:api"
start "WORKERS" powershell -NoExit -Command "npm run dev:workers"
start "SCRAPERS" powershell -NoExit -Command "npm run dev:scrapers"