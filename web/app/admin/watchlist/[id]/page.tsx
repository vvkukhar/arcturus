import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { WatchlistInlineEditor } from '@/components/admin/watchlist-inline-editor';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import type { WatchlistItem } from '@/lib/types';

type Props = { params: Promise<{ id: string }> };

export default async function AdminWatchlistDetailPage({ params }: Props) {
  const { id } = await params;
  let item: WatchlistItem;

  try {
    item = await api.get<WatchlistItem>(`/watchlist/${id}`);
  } catch {
    notFound();
  }

  if (!item) notFound();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{item.titleSnapshot}</h1>
          <p className="mt-1 text-sm text-slate-500 font-mono">ID: {item.id} | Base Item ID: {item.itemId}</p>
        </div>
        <StatusPill value={item.active ? 'Active' : 'Inactive'} />
      </div>

      <WatchlistInlineEditor item={item} />

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Economics">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Desired Buy</div>
              <div className="text-lg font-bold text-emerald-600">{formatMoney(item.desiredBuyPrice)}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Max Buy Limit</div>
              <div className="text-lg font-bold text-slate-900">{formatMoney(item.maxBuyPrice)}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Target Sell</div>
              <div className="text-lg font-bold text-blue-600">{formatMoney(item.targetSellPrice)}</div>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard title="Metadata" className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Assigned To</div>
              <div className="text-sm font-bold text-slate-900">{item.assignedUser?.name || 'Unassigned'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Priority (0-100)</div>
              <div className="text-sm font-bold text-slate-900">{item.priority}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Notes</div>
              <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl mt-1 border border-border">
                {item.notes || 'No notes attached.'}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}