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
    return await api.get<OpportunityItem[]>('/opportunities/buy?limit=100');
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <SectionCard title="Buy Opportunities" contentClassName="p-0 sm:p-6">
        <div className="mb-6 px-4 sm:px-0">
          <TableSearchForm placeholder="Search buy opportunities by title or item ID" />
        </div>
        <DataTable
          rows={filtered}
          emptyText="No buy opportunities available at the moment."
          getRowKey={(row) => `${row.itemId}-${row.sourceCode}`}
          columns={[
            {
              key: 'title',
              header: 'Asset',
              render: (row) => (
                <div className="flex flex-col gap-1 max-w-[280px]">
                  <Link
                    href={`/admin/opportunities/buy/${row.itemId}`}
                    className="font-black text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
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
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black ${row.score > 80 ? 'bg-emerald-100 text-emerald-700' : row.score > 50 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
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
              render: (row) => <span className="font-bold text-slate-900">{formatMoney(row.totalBuy)}</span>,
            },
            {
              key: 'sell',
              header: 'Target',
              render: (row) => <span className="font-bold text-blue-600">{formatMoney(row.targetSellPrice)}</span>,
            },
            {
              key: 'profit',
              header: 'Profit',
              render: (row) => <span className="font-black text-emerald-600">{formatMoney(row.profit)}</span>,
            },
            {
              key: 'roi',
              header: 'ROI',
              render: (row) => <span className="font-black text-emerald-600">{formatPercent(row.roi)}</span>,
            },
            {
              key: 'strategy',
              header: 'Strategy & Source',
              render: (row) => (
                <div className="flex flex-col gap-1.5">
                  <span className="inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white">
                    {row.flipStrategy ?? '—'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{row.sourceCode ?? '—'}</span>
                </div>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/opportunities/buy/${row.itemId}`}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95"
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