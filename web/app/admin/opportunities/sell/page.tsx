import Link from 'next/link';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';
import type { OpportunityItem } from '@/lib/types';

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const revalidate = 0;

async function getSellOpportunities(): Promise<OpportunityItem[]> {
  try {
    return await api.get<OpportunityItem[]>('/opportunities/sell?limit=50');
  } catch {
    return [];
  }
}

export default async function AdminSellOpportunitiesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const rows = await getSellOpportunities();
  
  const filtered = q
    ? rows.filter((row) =>
        `${row.title} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionCard title="Sell Opportunities">
        <div className="mb-6">
          <TableSearchForm placeholder="Search sell opportunities by title or item ID" />
        </div>
        <DataTable
          rows={filtered}
          emptyText="No sell opportunities available at the moment."
          getRowKey={(row) => `${row.itemId}-${row.inventoryItemId}`}
          columns={[
            {
              key: 'title',
              header: 'Item',
              render: (row) => (
                <div className="flex flex-col">
                  <Link
                    href={`/admin/opportunities/sell/${row.itemId}`}
                    className="font-bold text-[var(--foreground)] hover:text-blue-600 hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="mt-1 text-xs font-medium text-slate-400 font-mono">{row.itemId}</span>
                </div>
              ),
            },
            {
              key: 'score',
              header: 'Score',
              render: (row) => (
                <span className={`font-bold ${row.score > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {row.score.toFixed(0)}
                </span>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              render: (row) => <StatusPill value={row.action} />,
            },
            {
              key: 'cost',
              header: 'Cost Basis',
              render: (row) => <span className="font-medium text-[var(--foreground)]">{formatMoney(row.totalCostBasis)}</span>,
            },
            {
              key: 'sell',
              header: 'Target Sell',
              render: (row) => <span className="font-medium text-blue-600 dark:text-blue-400">{formatMoney(row.targetSellPrice)}</span>,
            },
            {
              key: 'profit',
              header: 'Est. Profit',
              render: (row) => <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(row.profit)}</span>,
            },
            {
              key: 'roi',
              header: 'ROI',
              render: (row) => <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPercent(row.roi)}</span>,
            },
            {
              key: 'strategy',
              header: 'Strategy',
              render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.flipStrategy ?? '—'}</span>,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/opportunities/sell/${row.itemId}`}
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 shadow-sm"
                  >
                    Details
                  </Link>
                  {row.inventoryItemId && (
                    <AddToRepriceFlowButton inventoryItemId={row.inventoryItemId} />
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