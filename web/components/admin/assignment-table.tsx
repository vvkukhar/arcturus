'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { ClipboardList } from 'lucide-react';
import type { InventoryItem, WatchlistItem } from '@/lib/types';

interface AssignmentsResponse {
  inventory: InventoryItem[];
  watchlist: WatchlistItem[];
}

export function AssignmentTable() {
  const { data } = useSWR<AssignmentsResponse>('/api/collaboration/assignments', swrFetcher, {
    fallbackData: { inventory: [], watchlist: [] }
  });

  if (!data) return null;

  return (
    <div className="rounded-[2rem] border border-[var(--border)] p-6 bg-[var(--card)] shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <ClipboardList size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Active Assignments</h2>
          <p className="text-sm font-medium text-slate-500">Currently allocated tasks</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {data.inventory.length === 0 && data.watchlist.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--background)]/50">
            No active assignments
          </div>
        ) : (
          data.inventory.map((x) => (
            <div key={x.id} className="border border-[var(--border)] bg-[var(--background)]/50 p-4 rounded-2xl hover:bg-[var(--background)] transition-colors">
              <div className="font-bold text-[var(--foreground)] line-clamp-1">{x.titleSnapshot}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">
                  Operator: <span className="font-bold text-[var(--foreground)]">{x.assignedUser?.name ?? 'Unknown'}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  Inventory
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}