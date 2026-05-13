#!/usr/bin/env bash
set -euo pipefail
rm -rf node_modules apps/api/node_modules apps/workers/node_modules apps/scrapers/node_modules
npm install
npm run build:all