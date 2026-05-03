'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { BulkSelectionToolbar } from '@/components/admin/bulk-selection-toolbar';
import { StatusPill } from '@/components/admin/status-pill';
import { WatchlistEditDialog } from '@/components/admin/watchlist-edit-dialog';
import { WatchlistDeleteButton } from '@/components/admin/watchlist-delete-button';
import { formatMoney, formatPercent } from '@/lib/format';

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
  rows: WatchlistRow[];
};

export function WatchlistBulkTable({ rows }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  };

  const clear = () => setSelected([]);

  const bulkAdd = async () => {
    try {
      setBulkLoading(true);

      await Promise.all(
        selected.map((id) =>
          fetch('/api/admin/flows/purchase/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ watchlistItemId: id }),
          }),
        ),
      );

      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkSetActive = async (active: boolean) => {
    try {
      setBulkLoading(true);

      await fetch('/api/admin/watchlist/bulk-activate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, active }),
      });

      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkDelete = async () => {
    const ok = window.confirm('Delete selected watchlist items?');

    if (!ok) return;

    try {
      setBulkLoading(true);

      await fetch('/api/admin/watchlist/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected }),
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
    <div>
      <BulkSelectionToolbar
        selectedCount={selected.length}
        onClear={clear}
        onBulkPurchase={bulkAdd}
      />

      {selected.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(true)}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-60"
          >
            Activate Selected
          </button>

          <button
            disabled={bulkLoading}
            onClick={() => bulkSetActive(false)}
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 disabled:opacity-60"
          >
            Deactivate Selected
          </button>

          <button
            disabled={bulkLoading}
            onClick={bulkDelete}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
          >
            {bulkLoading ? 'Working...' : 'Delete Selected'}
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Select
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Item
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Desired Buy
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Max Buy
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Target Sell
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Target ROI
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Priority
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={selectedSet.has(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <div>
                    <Link
                      href={`/admin/watchlist/${row.id}`}
                      className="font-bold hover:underline"
                    >
                      {row.titleSnapshot || row.itemId}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">{row.itemId}</div>
                  </div>
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.desiredBuyPrice)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.maxBuyPrice)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.targetSellPrice)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {row.targetSellPrice && row.maxBuyPrice > 0
                    ? formatPercent(
                        ((row.targetSellPrice - row.maxBuyPrice) / row.maxBuyPrice) *
                          100,
                      )
                    : '—'}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <StatusPill value={row.active ? 'active' : 'inactive'} />
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {row.priority}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <div className="flex flex-wrap gap-2">
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