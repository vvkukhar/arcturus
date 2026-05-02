import Link from 'next/link';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';

type SellRow = {
  inventoryItemId: string;
  itemId: string;
  title: string;
  score: number;
  action: string;
  profit: number;
  roi: number;
  marginPercent?: number;
  targetSellPrice?: number;
  totalCostBasis?: number;
  flipStrategy?: string;
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function getRows(): Promise<SellRow[]> {
  try {
    return await api.get<SellRow[]>('/opportunities/sell?limit=50');
  } catch {
    return [];
  }
}

export default async function AdminSellOpportunitiesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const rows = await getRows();
  const filtered = q
    ? rows.filter((row) =>
        `${row.title} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <SectionCard title="Sell Opportunities">
      <div className="mb-4">
        <TableSearchForm placeholder="Search sell opportunities" />
      </div>
      <DataTable
        rows={filtered}
        emptyText="No sell opportunities"
        columns={[
          {
            key: 'title',
            header: 'Item',
            render: (row) => (
              <div>
                <Link
                  href={`/admin/opportunities/sell/${row.itemId}`}
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
            key: 'cost',
            header: 'Cost Basis',
            render: (row) => formatMoney(row.totalCostBasis),
          },
          {
            key: 'sell',
            header: 'Target Sell',
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
            render: (row) => row.flipStrategy ?? '—',
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/opportunities/sell/${row.itemId}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  Details
                </Link>
                <AddToRepriceFlowButton inventoryItemId={row.inventoryItemId} />
              </div>
            ),
          },
        ]}
      />
    </SectionCard>
  );
}