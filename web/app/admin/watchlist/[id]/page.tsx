import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { WatchlistInlineEditor } from '@/components/admin/watchlist-inline-editor';

export default async function AdminWatchlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await api.get<any>(`/watchlist/${id}`);
  
  if (!item) return <div className="p-6 text-red-500 font-bold">Watchlist item not found</div>;

  return (
    <SectionCard title={`Watchlist: ${item.titleSnapshot || item.itemId}`}>
      <WatchlistInlineEditor item={item} />
    </SectionCard>
  );
}