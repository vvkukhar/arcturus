import Link from 'next/link';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';

type BuyRow = {
  watchlistItemId: string;
  itemId: string;
  title: string;
  score: number;
  action: string;
  profit: number;
  roi: number;
  marginPercent?: number;
  totalBuy?: number;
  targetSellPrice?: number;
  flipStrategy?: string;
  sourceCode?: string;
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function getRows(): Promise<BuyRow[]> {
  try {
    return await api.get<BuyRow[]>('/opportunities/buy?limit=50');
  } catch {
    return [];
  }
}

export default async function AdminBuyOpportunitiesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const rows = await getRows();
  const filtered = q
    ? rows.filter((row) =>
        `${row.title} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <SectionCard title="Buy Opportunities">
      <div className="mb-4">
        <TableSearchForm placeholder="Search buy opportunities" />
      </div>
      <DataTable
        rows={filtered}
        emptyText="No buy opportunities"
        columns={[
          {
            key: 'title',
            header: 'Item',
            render: (row) => (
              <div>
                <Link
                  href={`/admin/opportunities/buy/${row.itemId}`}
                  className="font-bold hover:underline"
                >
                  {row.title}
                </Link>
                <div className="mt-1 text-xs text-slate-500">{row.itemId}</div>
              </div>
            ),
          },
          {
            key: 'score',
            header: 'Score',
            render: (row) => row.score.toFixed(0),
          },
          {
            key: 'action',
            header: 'Action',
            render: (row) => <StatusPill value={row.action} />,
          },
          {
            key: 'buy',
            header: 'Buy',
            render: (row) => formatMoney(row.totalBuy),
          },
          {
            key: 'sell',
            header: 'Sell',
            render: (row) => formatMoney(row.targetSellPrice),
          },
          {
            key: 'profit',
            header: 'Profit',
            render: (row) => formatMoney(row.profit),
          },
          {
            key: 'roi',
            header: 'ROI',
            render: (row) => formatPercent(row.roi),
          },
          {
            key: 'strategy',
            header: 'Strategy',
            render: (row) => (
              <div className="space-y-1">
                <div>{row.flipStrategy ?? '—'}</div>
                <div className="text-xs text-slate-500">{row.sourceCode ?? '—'}</div>
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
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  Details
                </Link>
                <AddToPurchaseFlowButton watchlistItemId={row.watchlistItemId} />
              </div>
            ),
          },
        ]}
      />
    </SectionCard>
  );
}