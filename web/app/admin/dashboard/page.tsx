import Link from 'next/link';
import { AiSuggestionsPanel } from '@/components/admin/ai-suggestions-panel';
import { AuthStatus } from '@/components/admin/auth-status';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CollaborativeAssignmentPanel } from '@/components/admin/collaborative-assignment-panel';
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
import { formatMoney, formatPercent } from '@/lib/format';
import type {
  DailyPlanTask,
  DashboardExecutionSummary,
  DashboardFlowCounters,
  OpportunityItem,
  ReserveRequest,
  InventoryItem,
  DealItem
} from '@/lib/types';

export const revalidate = 0; // Disable caching for dashboard

async function getDashboardData() {
  const results = await Promise.allSettled([
    api.get<DashboardExecutionSummary>('/dashboard/execution-summary'),
    api.get<DashboardFlowCounters>('/dashboard/flow-counters'),
    api.get<OpportunityItem[]>('/opportunities/buy?limit=5'),
    api.get<OpportunityItem[]>('/opportunities/sell?limit=5'),
    api.get<DailyPlanTask[]>('/planning/daily'),
    api.get<ReserveRequest[]>('/public/reserve-requests'),
    api.get<InventoryItem[]>('/inventory'),
    publicApi.getAnalytics<any>(),
    api.get<DealItem[]>('/deals')
  ]);

  return {
    execution: results[0].status === 'fulfilled' ? results[0].value : null,
    counters: results[1].status === 'fulfilled' ? results[1].value : null,
    buyOpps: results[2].status === 'fulfilled' ? results[2].value : [],
    sellOpps: results[3].status === 'fulfilled' ? results[3].value : [],
    dailyPlan: results[4].status === 'fulfilled' ? results[4].value : [],
    reserves: results[5].status === 'fulfilled' ? results[5].value : [],
    inventory: results[6].status === 'fulfilled' ? results[6].value : [],
    storeAnalytics: results[7].status === 'fulfilled' ? results[7].value : null,
    deals: results[8].status === 'fulfilled' ? results[8].value : []
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const { execution, counters, buyOpps, sellOpps, dailyPlan, reserves, inventory, storeAnalytics, deals } = data;

  const pendingReserves = reserves.filter((x) => x.status === 'pending').length;
  const withImages = inventory.filter((x) => Array.isArray(x.images) && x.images.length > 0).length;
  const hotDeals = deals.filter((x) => x.action === 'BUY_NOW').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AuthStatus />
        <CreateItemDialog />
      </div>

      {execution?.headline && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm font-bold text-blue-800 shadow-sm">
          💡 {execution.headline}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard title="Purchase Queue" value={counters?.purchase ?? execution?.purchasePending ?? 0} subtitle="Pending buy execution" />
        <MetricCard title="Reprice Queue" value={counters?.reprice ?? execution?.repricePending ?? 0} subtitle="Inventory waiting for listing" />
        <MetricCard title="Review Queue" value={counters?.review ?? execution?.reviewPending ?? 0} subtitle="Manual checks pending" />
        <MetricCard title="Pending Reserves" value={pendingReserves} subtitle="Customer requests" />
        <MetricCard title="Media Coverage" value={withImages} subtitle="Listings with assets" />
        <MetricCard title="Hot Deals" value={hotDeals} subtitle="Scanner BUY_NOW matches" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardChartCard
          title="Flow Pipelines"
          labels={['Purchase', 'Reprice', 'Review']}
          values={[
            counters?.purchase ?? execution?.purchasePending ?? 0,
            counters?.reprice ?? execution?.repricePending ?? 0,
            counters?.review ?? execution?.reviewPending ?? 0,
          ]}
        />
        <DashboardChartCard
          title="Reserve Status"
          labels={['Pending', 'Approved', 'Contacted', 'Rejected']}
          values={[
            pendingReserves,
            reserves.filter((x) => x.status === 'approved').length,
            reserves.filter((x) => x.status === 'contacted').length,
            reserves.filter((x) => x.status === 'rejected').length,
          ]}
        />
        <DashboardChartCard
          title="Store Health"
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
        <SectionCard title="Top Buy Opportunities">
          <div className="space-y-3">
            {buyOpps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-medium text-slate-400">
                No active buy opportunities
              </div>
            ) : (
              buyOpps.map((item) => (
                <div key={`${item.itemId}-${item.title}`} className="rounded-2xl border border-border bg-slate-50/50 p-4 transition-colors hover:bg-white hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 leading-tight">{item.title}</div>
                      <div className="mt-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {item.action} • {item.actionReasonPrimary}
                      </div>
                    </div>
                    <Badge className={item.score > 80 ? 'bg-emerald-100 text-emerald-700' : ''}>
                      Score {item.score.toFixed(0)}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-600 border-t border-slate-200 pt-3">
                    <span className="text-emerald-600">Profit: {formatMoney(item.profit)}</span>
                    <span className="text-emerald-600">ROI: {formatPercent(item.roi)}</span>
                    {item.totalBuy != null && <span>Buy: {formatMoney(item.totalBuy)}</span>}
                    {item.targetSellPrice != null && <span>Sell: {formatMoney(item.targetSellPrice)}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Top Sell Opportunities">
          <div className="space-y-3">
            {sellOpps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-medium text-slate-400">
                No active sell opportunities
              </div>
            ) : (
              sellOpps.map((item) => (
                <div key={`${item.itemId}-${item.title}`} className="rounded-2xl border border-border bg-slate-50/50 p-4 transition-colors hover:bg-white hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 leading-tight">{item.title}</div>
                      <div className="mt-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {item.action} • {item.actionReasonPrimary}
                      </div>
                    </div>
                    <Badge className={item.score > 80 ? 'bg-blue-100 text-blue-700' : ''}>
                      Score {item.score.toFixed(0)}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-600 border-t border-slate-200 pt-3">
                    <span className="text-emerald-600">Profit: {formatMoney(item.profit)}</span>
                    <span className="text-emerald-600">ROI: {formatPercent(item.roi)}</span>
                    {item.targetSellPrice != null && <span>Target: {formatMoney(item.targetSellPrice)}</span>}
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
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-medium text-slate-400">
                All caught up for today!
              </div>
            ) : (
              dailyPlan.map((task) => (
                <div key={`${task.order}-${task.title}`} className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
                      {task.order}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{task.title}</div>
                      <div className="text-xs text-slate-500">{task.reason}</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-600">{task.type}</Badge>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Quick Links">
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/reserves', label: 'Reserve Queue' },
              { href: '/admin/orders/board', label: 'Order Board' },
              { href: '/admin/inventory', label: 'Inventory Media' },
              { href: '/admin/scanner', label: 'Scanner' },
              { href: '/admin/repricer', label: 'Repricer' },
              { href: '/admin/collaboration', label: 'Collaboration' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-center rounded-2xl border border-border bg-slate-50/50 p-4 text-sm font-bold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}