import { AiSuggestionsPanel } from '@/components/admin/ai-suggestions-panel';
import { AuthStatus } from '@/components/admin/auth-status';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CreateItemDialog } from '@/components/admin/create-item-dialog';
import { DashboardChartCard } from '@/components/admin/dashboard-chart-card';
import { LiveNotificationsPanel } from '@/components/admin/live-notifications-panel';
import { MetricCard } from '@/components/admin/metric-card';
import { NotificationsCenter } from '@/components/admin/notifications-center';
import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';
import { SectionCard } from '@/components/admin/section-card';
import { SuggestionsPanel } from '@/components/admin/suggestions-panel';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { formatMoney, formatPercent } from '@/lib/format';
import Link from 'next/link';
import type { DailyPlanTask, DashboardExecutionSummary, DashboardFlowCounters, OpportunityItem, ReserveRequest, InventoryItem, DealItem } from '@/lib/types';

export const revalidate = 0;

async function getDashboardData() {
  const requests = [
    api.get<DashboardExecutionSummary>('/dashboard/execution-summary'),
    api.get<DashboardFlowCounters>('/dashboard/flow-counters'),
    api.get<OpportunityItem[]>('/opportunities/buy?limit=5'),
    api.get<OpportunityItem[]>('/opportunities/sell?limit=5'),
    api.get<DailyPlanTask[]>('/planning/daily'),
    api.get<ReserveRequest[]>('/public/reserve-requests', { requireAuth: false }),
    api.get<InventoryItem[]>('/inventory'),
    api.get<any>('/public/analytics', { requireAuth: false }),
    api.get<DealItem[]>('/deals')
  ] as const;

  const results = await Promise.allSettled(requests);

  const getValue = <T,>(result: PromiseSettledResult<T>, fallback: T): T => 
    result.status === 'fulfilled' ? result.value : fallback;

  return {
    execution: getValue(results[0], null),
    counters: getValue(results[1], null),
    buyOpps: getValue(results[2], []),
    sellOpps: getValue(results[3], []),
    dailyPlan: getValue(results[4], []),
    reserves: getValue(results[5], []),
    inventory: getValue(results[6], []),
    storeAnalytics: getValue(results[7], null),
    deals: getValue(results[8], [])
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const pendingReserves = data.reserves.filter((x) => x.status === 'pending').length;
  const withImages = data.inventory.filter((x) => Array.isArray(x.images) && x.images.length > 0).length;
  const hotDeals = data.deals.filter((x) => x.action === 'BUY_NOW').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AuthStatus />
        <CreateItemDialog />
      </div>

      {data.execution?.headline && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm font-bold text-blue-800 shadow-sm">
          💡 {data.execution.headline}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard title="Purchase Queue" value={data.counters?.purchase ?? data.execution?.purchasePending ?? 0} subtitle="Pending buy execution" />
        <MetricCard title="Reprice Queue" value={data.counters?.reprice ?? data.execution?.repricePending ?? 0} subtitle="Inventory waiting for listing" />
        <MetricCard title="Review Queue" value={data.counters?.review ?? data.execution?.reviewPending ?? 0} subtitle="Manual checks pending" />
        <MetricCard title="Pending Reserves" value={pendingReserves} subtitle="Customer requests" />
        <MetricCard title="Media Coverage" value={withImages} subtitle="Listings with assets" />
        <MetricCard title="Hot Deals" value={hotDeals} subtitle="Scanner BUY_NOW matches" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardChartCard
          title="Flow Pipelines"
          labels={['Purchase', 'Reprice', 'Review']}
          values={[
            data.counters?.purchase ?? data.execution?.purchasePending ?? 0,
            data.counters?.reprice ?? data.execution?.repricePending ?? 0,
            data.counters?.review ?? data.execution?.reviewPending ?? 0,
          ]}
        />
        <DashboardChartCard
          title="Reserve Status"
          labels={['Pending', 'Approved', 'Contacted', 'Rejected']}
          values={[
            pendingReserves,
            data.reserves.filter((x) => x.status === 'approved').length,
            data.reserves.filter((x) => x.status === 'contacted').length,
            data.reserves.filter((x) => x.status === 'rejected').length,
          ]}
        />
        <DashboardChartCard
          title="Store Health"
          labels={['Inventory', 'Available', 'Reserves', 'Deals']}
          values={[
            data.storeAnalytics?.totalInventory ?? 0,
            data.storeAnalytics?.availableInventory ?? 0,
            data.storeAnalytics?.reserveRequests ?? 0,
            hotDeals,
          ]}
        />
      </div>

      <SuggestionsPanel />

      <div className="grid gap-6 xl:grid-cols-3">
        <AiSuggestionsPanel />
        <NotificationsCenter />
        <CollaborationPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LiveNotificationsPanel />
        <SalesRegistrationPanel />
      </div>
    </div>
  );
}