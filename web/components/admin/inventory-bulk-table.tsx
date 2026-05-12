'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { BulkSelectionToolbar } from '@/components/admin/bulk-selection-toolbar';
import { InventoryEditDialog } from '@/components/admin/inventory-edit-dialog';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';
import { InventoryDeleteButton } from '@/components/admin/inventory-delete-button';
import { apiFetch } from '@/lib/client-api';
import type { InventoryItem, ApiResponse } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type Props = {
  rows: InventoryItem[];
};

export function InventoryBulkTable({ rows }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

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
      setSelected(new Set(rows.map(r => r.id)));
    }
  }, [rows, selected.size]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const bulkAdd = useCallback(async () => {
    if (bulkLoading || selected.size === 0) return;
    try {
      setBulkLoading(true);
      const requests = Array.from(selected).map((id) =>
        apiFetch('/api/admin/flows/reprice/add', {
          method: 'POST',
          body: JSON.stringify({ inventoryItemId: id }),
        })
      );
      await Promise.all(requests);
      clear();
      router.refresh();
    } catch {
      alert('Error bulk adding to Reprice Flow');
    } finally {
      setBulkLoading(false);
    }
  }, [bulkLoading, selected, clear, router]);

  const bulkDelete = useCallback(async () => {
    if (bulkLoading || selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} items? This cannot be undone.`)) return;

    try {
      setBulkLoading(true);
      await apiFetch<ApiResponse<null>>('/api/admin/inventory/bulk-delete', {
        method: 'PATCH',
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      clear();
      router.refresh();
    } catch {
      alert('Error during bulk deletion');
    } finally {
      setBulkLoading(false);
    }
  }, [bulkLoading, selected, clear, router]);

  return (
    <div className="space-y-4">
      <BulkSelectionToolbar
        selectedCount={selected.size}
        onClear={clear}
        onBulkReprice={bulkAdd}
      />

      {selected.size > 0 && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
          <button
            disabled={bulkLoading}
            onClick={bulkDelete}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
          >
            {bulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {bulkLoading ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 text-left backdrop-blur-md">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  checked={selected.size > 0 && selected.size === rows.length}
                  ref={input => {
                    if (input) input.indeterminate = selected.size > 0 && selected.size < rows.length;
                  }}
                  onChange={toggleAll}
                />
              </th>
              {['Item', 'Purchase', 'Cost Basis', 'Manual Sell', 'Qty', 'Condition', 'Est. ROI', 'Actions'].map((header) => (
                <th key={header} className="border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500 backdrop-blur-md">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row) => {
              const estimatedRoi = row.expectedSalePriceManual && row.totalCost > 0
                ? ((row.expectedSalePriceManual - row.totalCost) / row.totalCost) * 100
                : null;

              return (
                <tr key={row.id} className="transition-colors hover:bg-[var(--background)]/80 group">
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selected.has(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>
                  <td className="px-4 py-4 align-middle text-sm">
                    <div className="flex flex-col">
                      <Link href={`/admin/inventory/${row.id}`} className="font-bold text-[var(--foreground)] hover:text-blue-600 hover:underline line-clamp-2">
                        {row.titleSnapshot || row.itemId}
                      </Link>
                      <span className="mt-1 text-xs font-medium text-slate-400 font-mono">{row.itemId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-sm font-medium text-slate-700 dark:text-slate-300">
                    {formatMoney(row.purchasePrice)}
                  </td>
                  <td className="px-4 py-4 align-middle text-sm font-bold text-[var(--foreground)]">
                    {formatMoney(row.totalCost)}
                  </td>
                  <td className="px-4 py-4 align-middle text-sm font-medium text-blue-600 dark:text-blue-400">
                    {formatMoney(row.expectedSalePriceManual)}
                  </td>
                  <td className="px-4 py-4 align-middle text-sm text-slate-700">
                    <span className="inline-flex items-center justify-center min-w-[2rem] rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-mono text-xs font-bold text-[var(--foreground)] border border-[var(--border)]">
                      {row.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{row.condition}</span>
                      <StatusPill value={row.sealed ? 'Sealed' : 'Used'} />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-sm">
                    <span className={estimatedRoi && estimatedRoi > 0 ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                      {estimatedRoi !== null ? formatPercent(estimatedRoi) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 justify-end">
                      <InventoryEditDialog item={row} />
                      <AddToRepriceFlowButton inventoryItemId={row.id} />
                      <InventoryDeleteButton id={row.id} />
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