import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { WatchlistItem } from '@/lib/types';
import { WatchlistInlineEditor } from '@/components/admin/watchlist-inline-editor';
import { SectionCard } from '@/components/admin/section-card';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

async function getWatchlistItem(id: string): Promise<WatchlistItem | null> {
  try {
    return await api.get<WatchlistItem>(`/watchlist/${id}`);
  } catch {
    return null;
  }
}

export default async function WatchlistDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getWatchlistItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/watchlist" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{item.titleSnapshot || item.itemId}</h1>
          <p className="mt-1 font-mono text-sm font-medium text-slate-500">ID: {item.id}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Watchlist Configuration">
            <WatchlistInlineEditor item={item} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Actions">
            <div className="space-y-4">
              <AddToPurchaseFlowButton watchlistItemId={item.id} />
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority Level</div>
                <div className="text-2xl font-black text-slate-900">{item.priority} / 10</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}