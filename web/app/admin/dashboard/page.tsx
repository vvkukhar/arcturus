'use client';

import { AiSuggestionsPanel } from '@/components/admin/ai-suggestions-panel';
import { AuthStatus } from '@/components/admin/auth-status';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CreateItemDialog } from '@/components/admin/create-item-dialog';
import { DashboardChartCard } from '@/components/admin/dashboard-chart-card';
import { LiveNotificationsPanel } from '@/components/admin/live-notifications-panel';
import { MetricCard } from '@/components/admin/metric-card';
import { NotificationsCenter } from '@/components/admin/notifications-center';
import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';
import { SuggestionsPanel } from '@/components/admin/suggestions-panel';
import { useI18n } from '@/components/providers/i18n-provider';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { t } = useI18n();

  const { data: execution } = useSWR<any>('/api/proxy/dashboard/execution-summary', swrFetcher, { refreshInterval: 10000 });
  const { data: counters } = useSWR<any>('/api/proxy/dashboard/flow-counters', swrFetcher, { refreshInterval: 10000 });
  const { data: reservesData } = useSWR<any[]>('/api/proxy/public/reserve-requests', swrFetcher, { refreshInterval: 15000 });
  const { data: inventoryData } = useSWR<any[]>('/api/proxy/inventory', swrFetcher, { refreshInterval: 30000 });
  const { data: storeAnalytics } = useSWR<any>('/api/proxy/public/analytics', swrFetcher, { refreshInterval: 30000 });
  const { data: dealsData } = useSWR<any[]>('/api/proxy/deals', swrFetcher, { refreshInterval: 15000 });

  const safeReserves = Array.isArray(reservesData) ? reservesData : [];
  const safeInventory = Array.isArray(inventoryData) ? inventoryData : [];
  const safeDeals = Array.isArray(dealsData) ? dealsData : [];

  const pendingReserves = safeReserves.filter((x) => x.status === 'pending').length;
  const withImages = safeInventory.filter((x) => Array.isArray(x.images) && x.images.length > 0).length;
  const hotDeals = safeDeals.filter((x) => x.action === 'BUY_NOW').length;

  if (!execution && !counters) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AuthStatus />
        <CreateItemDialog />
      </div>

      {execution?.headline && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800 backdrop-blur-xl p-5 text-sm font-black text-blue-900 dark:text-blue-100 shadow-sm ring-1 ring-inset ring-blue-500/10">
          💡 {execution.headline}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard title={t('admin.dashboard.purchaseQueue' as any)} value={counters?.purchase ?? execution?.purchasePending ?? 0} subtitle={t('admin.dashboard.purchaseQueueSub' as any)} />
        <MetricCard title={t('admin.dashboard.repriceQueue' as any)} value={counters?.reprice ?? execution?.repricePending ?? 0} subtitle={t('admin.dashboard.repriceQueueSub' as any)} />
        <MetricCard title={t('admin.dashboard.reviewQueue' as any)} value={counters?.review ?? execution?.reviewPending ?? 0} subtitle={t('admin.dashboard.reviewQueueSub' as any)} />
        <MetricCard title={t('admin.dashboard.pendingReserves' as any)} value={pendingReserves} subtitle={t('admin.dashboard.pendingReservesSub' as any)} />
        <MetricCard title={t('admin.dashboard.mediaCoverage' as any)} value={withImages} subtitle={t('admin.dashboard.mediaCoverageSub' as any)} />
        <MetricCard title={t('admin.dashboard.hotDeals' as any)} value={hotDeals} subtitle={t('admin.dashboard.hotDealsSub' as any)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardChartCard
          title={t('admin.dashboard.flowPipelines' as any)}
          labels={['Purchase', 'Reprice', 'Review']}
          values={[
            counters?.purchase ?? execution?.purchasePending ?? 0,
            counters?.reprice ?? execution?.repricePending ?? 0,
            counters?.review ?? execution?.reviewPending ?? 0,
          ]}
        />
        <DashboardChartCard
          title={t('admin.dashboard.reserveStatus' as any)}
          labels={['Pending', 'Approved', 'Contacted', 'Rejected']}
          values={[
            pendingReserves,
            safeReserves.filter((x) => x.status === 'approved').length,
            safeReserves.filter((x) => x.status === 'contacted').length,
            safeReserves.filter((x) => x.status === 'rejected').length,
          ]}
        />
        <DashboardChartCard
          title={t('admin.dashboard.storeHealth' as any)}
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
    </div>
  );
}