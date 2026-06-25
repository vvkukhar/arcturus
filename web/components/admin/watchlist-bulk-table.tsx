'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { BulkSelectionToolbar } from '@/components/admin/bulk-selection-toolbar';
import { StatusPill } from '@/components/admin/status-pill';
import { WatchlistEditDialog } from '@/components/admin/watchlist-edit-dialog';
import { WatchlistDeleteButton } from '@/components/admin/watchlist-delete-button';
import { formatMoney, formatPercent } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import type { WatchlistItem, ApiResponse } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

type Props = {
  rows: WatchlistItem[];
};

export function WatchlistBulkTable({ rows }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const selectedSet = useMemo(() => selected, [selected]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.id)));
    }
  }, [rows, selected.size]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const bulkAdd = useCallback(async () => {
    if (bulkLoading || selected.size === 0) return;
    try {
      setBulkLoading(true);
      const requests = Array.from(selected).map((id) =>
        apiFetch('/api/proxy/flows/purchase/add', {
          method: 'POST',
          body: JSON.stringify({ watchlistItemId: id }),
        })
      );
      await Promise.all(requests);
      clear();
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error adding to Purchase Flow');
    } finally {
      setBulkLoading(false);
    }
  }, [bulkLoading, selected, clear, router]);

  const bulkSetActive = useCallback(async (active: boolean) => {
    if (bulkLoading || selected.size === 0) return;
    try {
      setBulkLoading(true);
      await apiFetch<ApiResponse<null>>('/api/admin/watchlist/bulk-activate', {
        method: 'PATCH',
        body: JSON.stringify({ ids: Array.from(selected), active }),
      });
      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  }, [bulkLoading, selected, clear, router]);

  const bulkDelete = useCallback(async () => {
    if (bulkLoading || selected.size === 0) return;
    if (!window.confirm('Delete selected watchlist items?')) return;
    try {
      setBulkLoading(true);
      await apiFetch<ApiResponse<null>>('/api/admin/watchlist/bulk-delete', {
        method: 'DELETE',
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  }, [bulkLoading, selected, clear, router]);

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 rounded-[2rem] border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50 text-sm font-bold text-slate-400">
        {t('admin.watchlist.empty' as any)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BulkSelectionToolbar
        selectedCount={selected.size}
        onClear={clear}
        onBulkPurchase={bulkAdd}
      />

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors shadow-sm disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('admin.watchlist.activateSel' as any)}
          </button>
          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(false)}
            className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 transition-colors shadow-sm disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('admin.watchlist.deactivateSel' as any)}
          </button>
          <button
            disabled={bulkLoading}
            onClick={bulkDelete}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors shadow-sm disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('admin.watchlist.deleteSel' as any)}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-5 py-4 text-left">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  checked={selected.size > 0 && selected.size === rows.length}
                  ref={(input) => {
                    if (input) input.indeterminate = selected.size > 0 && selected.size < rows.length;
                  }}
                  onChange={toggleAll}
                />
              </th>
              {[
                t('admin.watchlist.col.asset' as any), 
                t('admin.watchlist.col.desired' as any), 
                t('admin.watchlist.col.max' as any), 
                t('admin.watchlist.col.target' as any), 
                t('admin.inventory.col.estRoi' as any), 
                t('common.status' as any), 
                t('admin.watchlist.col.priority' as any), 
                ''
              ].map((header) => (
                <th key={header as string} className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                  {header as string}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row) => {
              const roi = row.targetSellPrice && row.maxBuyPrice > 0
                ? ((row.targetSellPrice - row.maxBuyPrice) / row.maxBuyPrice) * 100
                : null;

              return (
                <tr key={row.id} className="transition-colors hover:bg-[var(--background)]/50 group">
                  <td className="px-5 py-4 align-middle">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedSet.has(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-col gap-1 max-w-[250px]">
                      <Link href={`/admin/watchlist/${row.id}`} className="font-black text-[var(--foreground)] hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {row.titleSnapshot || row.itemId}
                      </Link>
                      <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">{row.itemId}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatMoney(row.desiredBuyPrice)}
                  </td>
                  <td className="px-5 py-4 align-middle text-sm font-black text-[var(--foreground)]">
                    {formatMoney(row.maxBuyPrice)}
                  </td>
                  <td className="px-5 py-4 align-middle text-sm font-bold text-blue-600 dark:text-blue-400">
                    {formatMoney(row.targetSellPrice)}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-lg text-xs font-black",
                      roi && roi >= 30 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      roi && roi > 0 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {roi ? formatPercent(roi) : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <StatusPill value={row.active ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)] font-mono text-xs font-black text-[var(--foreground)] border border-[var(--border)]">
                      {row.priority}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-wrap items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <WatchlistEditDialog item={row} />
                      <AddToPurchaseFlowButton watchlistItemId={row.id} />
                      <WatchlistDeleteButton id={row.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}