import Link from 'next/link';
import { AiSuggestionsPanel } from '@/components/admin/ai-suggestions-panel';
import { AuthStatus } from '@/components/admin/auth-status';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CollaborativeAssignmentPanel } from '@/components/admin/collaborativeassignment-panel';
import { CreateItemDialog } from '@/components/admin/create-item-dialog';
import { DashboardChartCard } from '@/components/admin/dashboard-chart-card';
import { DealExplainer } from '@/components/admin/deal-explainer';
import { DealsPanel } from '@/components/admin/deals-panel';
import { LiveNotificationsPanel } from '@/components/admin/live-notifications-panel';
import { MetricCard } from '@/components/admin/metric-card';
import { NotificationsCenter } from '@/components/admin/notifications-center';
import { RepricerFromCompsPanel } from '@/components/admin/repricer-from-comps-panel';
import { RepricerPanel } from '@/components/admin/repricer-panel';
import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';
import { ScannerPanel } from '@/components/admin/scanner-panel';
import { ScannerRunnerPanel } from '@/components/admin/scanner-runner-panel';
import { SectionCard } from '@/components/admin/section-card';
import { SuggestionsPanel } from '@/components/admin/suggestions-panel';
import { UserManagement } from '@/components/admin/user-management';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { publicApi } from '@/lib/public-api';
import {
  DailyPlanTask,
  DashboardExecutionSummary,
  DashboardFlowCounters,
  OpportunityItem,
} from '@/lib/types';

async function getExecutionSummary(): Promise<DashboardExecutionSummary | null> {
  try {
    return await api.get<DashboardExecutionSummary>('/dashboard/execution-summary');
  } catch {
    return null;
  }
}

async function getFlowCounters(): Promise<DashboardFlowCounters | null> {
  try {
    return await api.get<DashboardFlowCounters>('/dashboard/flow-counters');
  } catch {
    return null;
  }
}

async function getBuyOpportunities(): Promise<OpportunityItem[]> {
  try {
    return await api.get<OpportunityItem[]>('/opportunities/buy?limit=5');
  } catch {
    return [];
  }
}

async function getSellOpportunities(): Promise<OpportunityItem[]> {
  try {
    return await api.get<OpportunityItem[]>('/opportunities/sell?limit=5');
  } catch {
    return [];
  }
}

async function getDailyPlan(): Promise<DailyPlanTask[]> {
  try {
    return await api.get<DailyPlanTask[]>('/planning/daily');
  } catch {
    return [];
  }
}

async function getReserves(): Promise<any[]> {
  try {
    return await api.get<any[]>('/public/reserve-requests');
  } catch {
    return [];
  }
}

async function getInventory(): Promise<any[]> {
  try {
    return await api.get<any[]>('/inventory');
  } catch {
    return [];
  }
}

async function getStoreAnalytics(): Promise<any | null> {
  try {
    return await publicApi.getAnalytics<any>();
  } catch {
    return null;
  }
}

async function getDeals(): Promise<any[]> {
  try {
    return await api.get<any[]>('/deals');
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [
    execution,
    counters,
    buyOpps,
    sellOpps,
    dailyPlan,
    reserves,
    inventory,
    storeAnalytics,
    deals,
  ] = await Promise.all([
    getExecutionSummary(),
    getFlowCounters(),
    getBuyOpportunities(),
    getSellOpportunities(),
    getDailyPlan(),
    getReserves(),
    getInventory(),
    getStoreAnalytics(),
    getDeals(),
  ]);

  const pendingReserves = reserves.filter((x) => x.status === 'pending').length;
  const withImages = inventory.filter((x) => Array.isArray(x.images) && x.images.length > 0).length;
  const hotDeals = deals.filter((x) => x.action === 'BUY_NOW').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <AuthStatus />
        <CreateItemDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          title="Purchase Queue"
          value={counters?.purchase ?? 0}
          subtitle="Pending buy execution items"
        />
        <MetricCard
          title="Reprice Queue"
          value={counters?.reprice ?? 0}
          subtitle="Inventory waiting for listing"
        />
        <MetricCard
          title="Review Queue"
          value={counters?.review ?? 0}
          subtitle="Manual checks still pending"
        />
        <MetricCard
          title="Pending Reserves"
          value={pendingReserves}
          subtitle="Customer reserve requests"
        />
        <MetricCard
          title="Inventory With Images"
          value={withImages}
          subtitle="Listings with visual assets"
        />
        <MetricCard
          title="Hot Deals"
          value={hotDeals}
          subtitle="Scanner BUY_NOW matches"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardChartCard
          title="Flow Queues"
          labels={['Purchase', 'Reprice', 'Review']}
          values={[
            counters?.purchase ?? 0,
            counters?.reprice ?? 0,
            counters?.review ?? 0,
          ]}
        />
        <DashboardChartCard
          title="Reserve Status"
          labels={['Pending', 'Approved', 'Contacted', 'Rejected']}
          values={[
            reserves.filter((x) => x.status === 'pending').length,
            reserves.filter((x) => x.status === 'approved').length,
            reserves.filter((x) => x.status === 'contacted').length,
            reserves.filter((x) => x.status === 'rejected').length,
          ]}
        />
        <DashboardChartCard
          title="Store Analytics"
          labels={['Inventory', 'Available', 'Reserves', 'Deals']}
          values={[
            storeAnalytics?.totalInventory ?? 0,
            storeAnalytics?.availableInventory ?? 0,
            storeAnalytics?.reserveRequests ?? 0,
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

      <div className="grid gap-6 xl:grid-cols-2">
        <CollaborativeAssignmentPanel />
        <UserManagement />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RepricerPanel />
        <DealExplainer />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ScannerPanel />
        <ScannerRunnerPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RepricerFromCompsPanel />
        <DealsPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Top Buy Opportunities">
          <div className="space-y-3">
            {buyOpps.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              buyOpps.map((item) => (
                <div
                  key={`${item.itemId}-${item.title}`}
                  className="rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.action} • {item.actionReasonPrimary}
                      </div>
                    </div>
                    <Badge>Score {item.score}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span>Profit {item.profit}</span>
                    <span>ROI {item.roi}%</span>
                    {item.totalBuy != null ? <span>Buy {item.totalBuy}</span> : null}
                    {item.targetSellPrice != null ? <span>Sell {item.targetSellPrice}</span> : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Top Sell Opportunities">
          <div className="space-y-3">
            {sellOpps.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              sellOpps.map((item) => (
                <div
                  key={`${item.itemId}-${item.title}`}
                  className="rounded-2xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.action} • {item.actionReasonPrimary}
                      </div>
                    </div>
                    <Badge>Score {item.score}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span>Profit {item.profit}</span>
                    <span>ROI {item.roi}%</span>
                    {item.targetSellPrice != null ? <span>Target {item.targetSellPrice}</span> : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Daily Plan">
          <div className="space-y-3">
            {dailyPlan.length === 0 ? (
              <div className="text-sm text-slate-500">No plan data</div>
            ) : (
              dailyPlan.map((task) => (
                <div
                  key={`${task.order}-${task.title}`}
                  className="rounded-2xl border border-border p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-bold">
                      {task.order}. {task.title}
                    </div>
                    <Badge>{task.type}</Badge>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{task.reason}</div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Quick Links">
          <div className="space-y-3">
            <Link
              href="/admin/reserves"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Reserve Queue
            </Link>
            <Link
              href="/admin/orders/board"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Order Status Board
            </Link>
            <Link
              href="/admin/inventory"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Inventory Media
            </Link>
            <Link
              href="/admin/activity"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Activity Log
            </Link>
            <Link
              href="/admin/collaboration"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Collaboration
            </Link>
            <Link
              href="/admin/repricer"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Repricer
            </Link>
            <Link
              href="/admin/scanner"
              className="block rounded-2xl border border-border p-4 font-bold hover:bg-slate-50"
            >
              Open Scanner
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}