# Arcturus Release Checklist

## Database
- Set production DATABASE_URL
- Run prisma generate
- Run prisma migrate deploy
- Run seed only if production seed is intended
- Apply `supabase/policies.sql`

## Supabase
- Set SUPABASE_URL
- Set SUPABASE_ANON_KEY
- Set SUPABASE_SERVICE_ROLE_KEY
- Verify JWT issuer
- Verify authenticated users can sign in
- Verify app_metadata role is present for admin/operator users

## API
- Build backend image
- Set ALLOWED_ORIGINS
- Verify CORS
- Verify auth guard on operator/source-health/sync endpoints
- Verify public read endpoints that should remain open
- Verify health endpoint

## Workers
- Set production DATABASE_URL
- Verify scheduled loop starts
- Verify refresh jobs create snapshots and decisions
- Verify logs are visible in runtime

## Scrapers
- Set production DATABASE_URL
- Verify source runs are recorded
- Verify sync errors are recorded
- Verify unresolved matches are queued
- Verify manual source rerun requests are recorded

## Flutter app
- Set production API base URL
- Verify login token is attached on protected routes
- Verify dashboard loads
- Verify opportunities load
- Verify operator screens load for authorized users
- Verify unresolved match resolve flow works
- Verify source rerun works

## Data quality
- Verify market snapshots update
- Verify sell opportunities show margin and ROI
- Verify buy opportunities show total cost basis and freshness
- Verify source health summary updates
- Verify sync summary updates

## Security
- Rotate leaked keys if any test key was exposed
- Confirm service role key is never shipped in Flutter app
- Confirm only backend uses service role key
- Confirm RLS policies are active
- Confirm protected endpoints reject missing/invalid Bearer tokens

## Final smoke test
- Create item
- Add to watchlist
- Trigger refresh all
- Open best buy opportunities
- Create inventory item
- Open best sell opportunities
- Open unresolved match queue
- Open source runs
- Open sync errors