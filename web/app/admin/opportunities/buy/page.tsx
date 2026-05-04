import Link from 'next/link';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
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

async function getBuyOpportunities(): Promise<OpportunityItem[]> {
  try {
    return await api.get<OpportunityItem[]>('/opportunities/buy?limit=50');
  } catch {
    return [];
  }
}

export default async function AdminBuyOpportunitiesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const rows = await getBuyOpportunities();
  
  const filtered = q
    ? rows.filter((row) =>
        `${row.title} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <SectionCard title="Buy Opportunities">
      <div className="mb-6">
        <TableSearchForm placeholder="Search buy opportunities by title or item ID" />
      </div>
      <DataTable
        rows={filtered}
        emptyText="No buy opportunities available at the moment."
        getRowKey={(row) => `${row.itemId}-${row.sourceCode}`}
        columns={[
          {
            key: 'title',
            header: 'Item',
            render: (row) => (
              <div className="flex flex-col">
                <Link
                  href={`/admin/opportunities/buy/${row.itemId}`}
                  className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
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
              <span className={`font-bold ${row.score > 80 ? 'text-emerald-600' : 'text-slate-700'}`}>
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
            key: 'buy',
            header: 'Buy Price',
            render: (row) => <span className="font-medium text-slate-700">{formatMoney(row.totalBuy)}</span>,
          },
          {
            key: 'sell',
            header: 'Target Sell',
            render: (row) => <span className="font-medium text-blue-600">{formatMoney(row.targetSellPrice)}</span>,
          },
          {
            key: 'profit',
            header: 'Est. Profit',
            render: (row) => <span className="font-bold text-emerald-600">{formatMoney(row.profit)}</span>,
          },
          {
            key: 'roi',
            header: 'ROI',
            render: (row) => <span className="font-bold text-emerald-600">{formatPercent(row.roi)}</span>,
          },
          {
            key: 'strategy',
            header: 'Strategy & Source',
            render: (row) => (
              <div className="space-y-1">
                <div className="font-semibold text-slate-700">{row.flipStrategy ?? '—'}</div>
                <div className="text-xs font-mono text-slate-400">{row.sourceCode ?? '—'}</div>
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/opportunities/buy/${row.itemId}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                >
                  Details
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
  );
}