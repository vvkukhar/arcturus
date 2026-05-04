import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { ReserveFilters } from '@/components/admin/reserve-filters';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';
import type { ReserveRequest } from '@/lib/types';

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

async function getReserves(q?: string, status?: string): Promise<ReserveRequest[]> {
  try {
    const search = new URLSearchParams();
    if (q) search.set('q', q);
    if (status) search.set('status', status);

    const query = search.toString() ? `?${search.toString()}` : '';
    return await api.get<ReserveRequest[]>(`/public/reserve-requests${query}`);
  } catch {
    return [];
  }
}

export default async function AdminReservesPage({ searchParams }: Props) {
  const { q, status } = await searchParams;
  const rows = await getReserves(q, status);

  return (
    <SectionCard title="Reserve Requests">
      <div className="mb-6 space-y-4">
        <TableSearchForm placeholder="Search reserves by product, name, contact..." />
        <ReserveFilters currentStatus={status ?? 'all'} />
      </div>

      <DataTable
        rows={rows}
        emptyText="No reserve requests found."
        getRowKey={(row) => row.id}
        columns={[
          {
            key: 'product',
            header: 'Product',
            render: (row) => (
              <div className="flex flex-col">
                <Link
                  href={`/admin/reserves/${row.id}`}
                  className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                >
                  {row.productTitle || '—'}
                </Link>
                <span className="mt-1 text-xs font-medium text-slate-400 font-mono">
                  {row.inventoryItemId ?? row.id}
                </span>
              </div>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            render: (row) => (
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">{row.name}</span>
                <span className="mt-1 text-xs font-medium text-slate-500">{row.contact}</span>
              </div>
            ),
          },
          {
            key: 'message',
            header: 'Message',
            render: (row) => (
              <span className="text-slate-600 line-clamp-2 max-w-xs" title={row.message ?? ''}>
                {row.message ?? '—'}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusPill value={row.status} />,
          },
          {
            key: 'created',
            header: 'Date',
            render: (row) => (
              <span className="text-slate-500 whitespace-nowrap">
                {row.createdAt ? new Date(row.createdAt).toLocaleDateString('uk-UA') : '—'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => <ReserveRequestActions id={row.id} currentStatus={row.status} />,
          },
        ]}
      />
    </SectionCard>
  );
}