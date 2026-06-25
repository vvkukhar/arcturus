import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { ReserveFilters } from '@/components/admin/reserve-filters';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { api } from '@/lib/api';
import type { ReserveRequest } from '@/lib/types';
import { dict } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export const revalidate = 0;

async function getReserves(q?: string, status?: string): Promise<ReserveRequest[]> {
  try {
    const search = new URLSearchParams();
    if (q) search.set('q', q);
    if (status && status !== 'all') search.set('status', status);

    const query = search.toString() ? `?${search.toString()}` : '';
    return await api.get<ReserveRequest[]>(`/public/reserve-requests${query}`);
  } catch {
    return [];
  }
}

export default async function AdminReservesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const { q, status } = resolvedParams;
  const rows = await getReserves(q, status);
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.reserves.title' as any)}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage incoming customer reservations and orders from the public store.
          </p>
        </div>
      </div>

      <SectionCard title="Active Requests" contentClassName="p-0 sm:p-6">
        <div className="mb-6 space-y-4 px-4 sm:px-0">
          <TableSearchForm placeholder={t('admin.reserves.search' as any)} />
          <ReserveFilters currentStatus={status ?? 'all'} />
        </div>

        <DataTable
          rows={rows}
          emptyText={t('admin.reserves.empty' as any)}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'product',
              header: 'Product',
              render: (row) => (
                <div className="flex flex-col max-w-[250px]">
                  <Link
                    href={`/admin/reserves/${row.id}`}
                    className="font-bold text-[var(--foreground)] hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {row.productTitle || '—'}
                  </Link>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                    {row.inventoryItemId ?? row.id.slice(0, 8)}
                  </span>
                </div>
              ),
            },
            {
              key: 'customer',
              header: 'Customer',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-semibold text-[var(--foreground)]">{row.name}</span>
                  <span className="mt-1 text-xs font-medium text-slate-500">{row.contact}</span>
                </div>
              ),
            },
            {
              key: 'message',
              header: 'Message',
              render: (row) => (
                <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-xs" title={row.message ?? ''}>
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
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
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
    </div>
  );
}