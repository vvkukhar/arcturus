import { api } from '@/lib/api';
import { WatchlistInlineEditor } from '@/components/admin/watchlist-inline-editor';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import type { WatchlistItem } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getWatchlistItem(id: string): Promise<WatchlistItem | null> {
  try {
    return await api.get<WatchlistItem>(`/watchlist/${id}`);
  } catch {
    return null;
  }
}

export default async function AdminWatchlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getWatchlistItem(id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Watchlist Item Not Found</h2>
        <Link href="/admin/watchlist" className="mt-4 text-blue-600 hover:underline">
          Return to Watchlist
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/watchlist" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{item.titleSnapshot}</h1>
          <p className="text-sm font-mono text-slate-500 mt-1">ID: {item.id} | Base Item: {item.itemId}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Configuration">
            <WatchlistInlineEditor item={item} />
          </SectionCard>

          <SectionCard title="Target Metrics">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Desired Buy</div>
                <div className="text-xl font-black text-emerald-600">{formatMoney(item.desiredBuyPrice)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Max Buy</div>
                <div className="text-xl font-black text-slate-900">{formatMoney(item.maxBuyPrice)}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target Sell</div>
                <div className="text-xl font-black text-blue-600">{formatMoney(item.targetSellPrice)}</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Properties">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-500">Status</span>
                <StatusPill value={item.active ? 'Active' : 'Inactive'} />
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-500">Priority</span>
                <span className="font-mono font-bold text-lg">{item.priority}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-500">Assigned To</span>
                <span className="font-semibold">{item.assignedUser?.name ?? 'Unassigned'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Added</span>
                <span className="text-sm font-mono text-slate-700">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('uk-UA') : 'N/A'}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}