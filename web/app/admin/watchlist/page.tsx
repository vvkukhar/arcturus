import { CreateWatchlistDialog } from '@/components/admin/create-watchlist-dialog';
import { SectionCard } from '@/components/admin/section-card';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { WatchlistBulkTable } from '@/components/admin/watchlist-bulk-table';
import { api } from '@/lib/api';

type WatchlistRow = {
  id: string;
  itemId: string;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active: boolean;
  priority: number;
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function getWatchlist(): Promise<WatchlistRow[]> {
  try {
    return await api.get<WatchlistRow[]>('/watchlist');
  } catch {
    return [];
  }
}

export default async function AdminWatchlistPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const rows = await getWatchlist();

  const filtered = q
    ? rows.filter((row) =>
        `${row.titleSnapshot} ${row.itemId}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : rows;

  return (
    <SectionCard title="Watchlist">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[320px] flex-1">
          <TableSearchForm placeholder="Search watchlist by title or item id" />
        </div>
        <CreateWatchlistDialog />
      </div>

      <WatchlistBulkTable rows={filtered} />
    </SectionCard>
  );
}