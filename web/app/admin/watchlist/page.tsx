import { CreateWatchlistDialog } from '@/components/admin/create-watchlist-dialog';
import { SectionCard } from '@/components/admin/section-card';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { WatchlistBulkTable } from '@/components/admin/watchlist-bulk-table';
import { api } from '@/lib/api';
import type { WatchlistItem } from '@/lib/types';
import { ExportCsvButton } from '@/components/admin/export-csv-button';

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const revalidate = 0;

async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    return await api.get<WatchlistItem[]>('/watchlist');
  } catch {
    return [];
  }
}

export default async function AdminWatchlistPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const rows = await getWatchlist();

  const filtered = q
    ? rows.filter((row) =>
        `${row.titleSnapshot} ${row.itemId}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : rows;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Watchlist</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Monitor target assets, pricing thresholds, and trigger automated procurement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExportCsvButton
            endpoint="/api/admin/watchlist/export"
            filename={`arcturus_watchlist_${new Date().toISOString().split('T')[0]}.csv`}
          />
          <CreateWatchlistDialog />
        </div>
      </div>

      <SectionCard title="Active Targets" contentClassName="p-0 sm:p-6">
        <div className="mb-6 px-4 sm:px-0">
          <TableSearchForm placeholder="Search watchlist by title or item id" />
        </div>

        <WatchlistBulkTable rows={filtered} />
      </SectionCard>
    </div>
  );
}