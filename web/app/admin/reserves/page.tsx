import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { ReserveFilters } from '@/components/admin/reserve-filters';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';

type ReserveRow = {
  id: string;
  inventoryItemId?: string | null;
  productTitle: string;
  name: string;
  contact: string;
  message?: string | null;
  status: string;
  adminNote?: string | null;
  createdAt?: string;
};

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

async function getRows(q?: string, status?: string): Promise<ReserveRow[]> {
  try {
    const search = new URLSearchParams();

    if (q) search.set('q', q);
    if (status) search.set('status', status);

    return await api.get<ReserveRow[]>(
      `/public/reserve-requests${search.toString() ? `?${search.toString()}` : ''}`,
    );
  } catch {
    return [];
  }
}

export default async function AdminReservesPage({ searchParams }: Props) {
  const { q, status } = await searchParams;
  const rows = await getRows(q, status);

  return (
    <SectionCard title="Reserve Requests">
      <div className="mb-4 space-y-3">
        <TableSearchForm placeholder="Search reserves by product, name, contact" />
        <ReserveFilters />
      </div>
      <DataTable
        rows={rows}
        emptyText="No reserve requests"
        columns={[
          {
            key: 'product',
            header: 'Product',
            render: (row) => (
              <div>
                <Link
                  href={`/admin/reserves/${row.id}`}
                  className="font-bold hover:underline"
                >
                  {row.productTitle || '—'}
                </Link>
                <div className="mt-1 text-xs text-slate-500">{row.inventoryItemId ?? row.id}</div>
              </div>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            render: (row) => (
              <div>
                <div>{row.name}</div>
                <div className="mt-1 text-xs text-slate-500">{row.contact}</div>
              </div>
            ),
          },
          {
            key: 'message',
            header: 'Message',
            render: (row) => row.message ?? '—',
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusPill value={row.status} />,
          },
          {
            key: 'created',
            header: 'Created',
            render: (row) => row.createdAt ?? '—',
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => <ReserveRequestActions id={row.id} />,
          },
        ]}
      />
    </SectionCard>
  );
}