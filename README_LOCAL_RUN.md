# Arcturus Local Run

## 1. Prepare Supabase

Create a Supabase project.
Copy the Postgres connection string.
Put the same DATABASE_URL into:
- backend/api/.env
- backend/workers/.env
- backend/scrapers/.env

## 2. Bootstrap backend

Run:
- cd backend/api
- npm install
- npm run bootstrap

## 3. Start services

Option A:
- cd backend
- docker compose up --build

Option B:
- make api
- make workers
- make scrapers

## 4. Start Flutter app

Set `lib/core/config/api_config.dart`
For Android emulator use:
- http://10.0.2.2:4000/api

For iOS simulator use:
- http://localhost:4000/api

## 5. Basic flow

- app opens dashboard
- scrapers ingest source data
- workers recompute snapshots and decisions
- app refreshes opportunities, flows, source health and sync state

## 6. First actions

- create item
- create watchlist item
- run refresh all
- inspect opportunities
- move best candidates into flows