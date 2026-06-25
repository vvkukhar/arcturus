import Link from 'next/link';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { AiNegotiateButton } from '@/components/admin/ai-negotiate-button'; 
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';
import type { OpportunityItem } from '@/lib/types';
import { dict } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const revalidate = 0;

async function getBuyOpportunities(): Promise<OpportunityItem[]> {
  try {
    return await api.get<OpportunityItem[]>('/opportunities/buy?limit=100');
  } catch {
    return [];
  }
}

export default async function AdminBuyOpportunitiesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const rows = await getBuyOpportunities();
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;
  
  const filtered = q
    ? rows.filter((row) =>
        `${row.title} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.opps.buy.title' as any)}</h1>
      </div>
      <SectionCard title={t('admin.opps.buy.title' as any)} contentClassName="p-0 sm:p-6">
        <div className="mb-6 px-4 sm:px-0">
          <TableSearchForm placeholder={t('admin.opps.buy.search' as any)} />
        </div>
        <DataTable
          rows={filtered}
          emptyText={t('admin.opps.buy.empty' as any)}
          getRowKey={(row) => `${row.itemId}-${row.sourceCode}`}
          columns={[
            {
              key: 'title',
              header: 'Asset',
              render: (row) => (
                <div className="flex flex-col gap-1 max-w-[280px]">
                  <Link
                    href={`/admin/opportunities/buy/${row.itemId}`}
                    className="font-black text-[var(--foreground)] hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
                  >
                    {row.title}
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{row.itemId}</span>
                </div>
              ),
            },
            {
              key: 'score',
              header: 'Score',
              render: (row) => (
                <div className="flex items-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black ${row.score > 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : row.score > 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {row.score.toFixed(0)}
                  </span>
                </div>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              render: (row) => <StatusPill value={row.action} />,
            },
            {
              key: 'buy',
              header: 'Entry',
              render: (row) => <span className="font-bold text-[var(--foreground)]">{formatMoney(row.totalBuy)}</span>,
            },
            {
              key: 'sell',
              header: 'Target',
              render: (row) => <span className="font-bold text-blue-600 dark:text-blue-400">{formatMoney(row.targetSellPrice)}</span>,
            },
            {
              key: 'profit',
              header: 'Profit',
              render: (row) => <span className="font-black text-emerald-600 dark:text-emerald-400">{formatMoney(row.profit)}</span>,
            },
            {
              key: 'roi',
              header: 'ROI',
              render: (row) => <span className="font-black text-emerald-600 dark:text-emerald-400">{formatPercent(row.roi)}</span>,
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex items-center justify-end gap-2">
                  <AiNegotiateButton 
                    title={row.title} 
                    currentPrice={row.totalBuy ?? 0} 
                    targetPrice={row.totalBuy ? row.totalBuy * 0.85 : 0} 
                  />
                  <Link
                    href={`/admin/opportunities/buy/${row.itemId}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--background)] border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--foreground)] transition-all hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95"
                  >
                    View
                  </Link>
                  {row.watchlistItemId && (
                    <AddToPurchaseFlowButton watchlistItemId={row.watchlistItemId} />
                  )}
                </div>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}