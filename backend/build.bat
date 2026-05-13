@echo off
cd /d "%~dp0"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "apps\api\node_modules" rmdir /s /q "apps\api\node_modules"
if exist "apps\workers\node_modules" rmdir /s /q "apps\workers\node_modules"
if exist "apps\scrapers\node_modules" rmdir /s /q "apps\scrapers\node_modules"
call npm install
call npm run build:all