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
import { apiFetch } from '@/lib/client-api';
import type { WatchlistItem, ApiResponse } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type Props = {
  rows: WatchlistItem[];
};

export function WatchlistBulkTable({ rows }: Props) {
  const router = useRouter();
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

  const bulkAdd = async () => {
    try {
      setBulkLoading(true);
      const requests = Array.from(selected).map((id) =>
        apiFetch('/api/admin/flows/purchase/add', {
          method: 'POST',
          body: JSON.stringify({ watchlistItemId: id }),
        })
      );
      await Promise.all(requests);
      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkSetActive = async (active: boolean) => {
    try {
      setBulkLoading(true);
      await apiFetch('/api/admin/watchlist/bulk-activate', {
        method: 'PATCH',
        body: JSON.stringify({ ids: Array.from(selected), active }),
      });
      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (!window.confirm('Delete selected watchlist items?')) return;
    try {
      setBulkLoading(true);
      await apiFetch('/api/admin/watchlist/bulk-delete', {
        method: 'DELETE',
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  if (rows.length === 0) {
    return <div className="text-sm text-slate-500">Watchlist is empty</div>;
  }

  return (
    <div className="space-y-4">
      <BulkSelectionToolbar
        selectedCount={selected.size}
        onClear={clear}
        onBulkPurchase={bulkAdd}
      />

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Activate Selected
          </button>
          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(false)}
            className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Deactivate Selected
          </button>
          <button
            disabled={bulkLoading}
            onClick={bulkDelete}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-border bg-slate-50/80 px-4 py-4 text-left">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={selected.size > 0 && selected.size === rows.length}
                  ref={(input) => {
                    if (input) input.indeterminate = selected.size > 0 && selected.size < rows.length;
                  }}
                  onChange={toggleAll}
                />
              </th>
              {['Item', 'Desired Buy', 'Max Buy', 'Target Sell', 'Target ROI', 'Status', 'Priority', 'Actions'].map((header) => (
                <th key={header} className="border-b border-border bg-slate-50/80 px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/80 group">
                <td className="px-4 py-4 align-top text-sm text-slate-800">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedSet.has(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-800">
                  <div className="flex flex-col">
                    <Link href={`/admin/watchlist/${row.id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline">
                      {row.titleSnapshot || row.itemId}
                    </Link>
                    <span className="mt-1 text-xs font-medium text-slate-400 font-mono">{row.itemId}</span>
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-sm font-medium text-emerald-600">
                  {formatMoney(row.desiredBuyPrice)}
                </td>
                <td className="px-4 py-4 align-top text-sm font-bold text-slate-900">
                  {formatMoney(row.maxBuyPrice)}
                </td>
                <td className="px-4 py-4 align-top text-sm font-medium text-blue-600">
                  {formatMoney(row.targetSellPrice)}
                </td>
                <td className="px-4 py-4 align-top text-sm font-bold text-slate-700">
                  {row.targetSellPrice && row.maxBuyPrice > 0
                    ? formatPercent(((row.targetSellPrice - row.maxBuyPrice) / row.maxBuyPrice) * 100)
                    : '—'}
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-800">
                  <StatusPill value={row.active ? 'active' : 'inactive'} />
                </td>
                <td className="px-4 py-4 align-top text-sm font-mono font-bold text-slate-700">
                  {row.priority}
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-800">
                  <div className="flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <WatchlistEditDialog item={row} />
                    <AddToPurchaseFlowButton watchlistItemId={row.id} />
                    <WatchlistDeleteButton id={row.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}