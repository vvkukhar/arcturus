alter table if exists public."Item" enable row level security;
alter table if exists public."InventoryItem" enable row level security;
alter table if exists public."WatchlistItem" enable row level security;
alter table if exists public."MarketSource" enable row level security;
alter table if exists public."MarketListing" enable row level security;
alter table if exists public."MarketSnapshot" enable row level security;
alter table if exists public."DecisionSnapshot" enable row level security;
alter table if exists public."PurchaseFlowItem" enable row level security;
alter table if exists public."RepriceFlowItem" enable row level security;
alter table if exists public."ReviewFlowItem" enable row level security;
alter table if exists public."SourceRunLog" enable row level security;
alter table if exists public."SyncErrorLog" enable row level security;
alter table if exists public."UnresolvedMatchQueue" enable row level security;

drop policy if exists authenticated_read_item on public."Item";
create policy authenticated_read_item
on public."Item"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_inventory on public."InventoryItem";
create policy authenticated_read_inventory
on public."InventoryItem"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_watchlist on public."WatchlistItem";
create policy authenticated_read_watchlist
on public."WatchlistItem"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_market_source on public."MarketSource";
create policy authenticated_read_market_source
on public."MarketSource"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_market_listing on public."MarketListing";
create policy authenticated_read_market_listing
on public."MarketListing"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_market_snapshot on public."MarketSnapshot";
create policy authenticated_read_market_snapshot
on public."MarketSnapshot"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_decision_snapshot on public."DecisionSnapshot";
create policy authenticated_read_decision_snapshot
on public."DecisionSnapshot"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_purchase_flow on public."PurchaseFlowItem";
create policy authenticated_read_purchase_flow
on public."PurchaseFlowItem"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_reprice_flow on public."RepriceFlowItem";
create policy authenticated_read_reprice_flow
on public."RepriceFlowItem"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_review_flow on public."ReviewFlowItem";
create policy authenticated_read_review_flow
on public."ReviewFlowItem"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_source_run_log on public."SourceRunLog";
create policy authenticated_read_source_run_log
on public."SourceRunLog"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_sync_error_log on public."SyncErrorLog";
create policy authenticated_read_sync_error_log
on public."SyncErrorLog"
for select
to authenticated
using (true);

drop policy if exists authenticated_read_unresolved_match on public."UnresolvedMatchQueue";
create policy authenticated_read_unresolved_match
on public."UnresolvedMatchQueue"
for select
to authenticated
using (true);