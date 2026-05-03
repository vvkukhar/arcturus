'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { BulkSelectionToolbar } from '@/components/admin/bulk-selection-toolbar';
import { InventoryEditDialog } from '@/components/admin/inventory-edit-dialog';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';
import { InventoryDeleteButton } from '@/components/admin/inventory-delete-button';

type InventoryRow = {
  id: string;
  itemId: string;
  titleSnapshot: string;
  purchasePrice: number;
  totalCost: number;
  expectedSalePriceManual?: number | null;
  quantity: number;
  condition: string;
  sealed: boolean;
};

type Props = {
  rows: InventoryRow[];
};

export function InventoryBulkTable({ rows }: Props) {
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
          fetch('/api/admin/flows/reprice/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventoryItemId: id }),
          }),
        ),
      );

      clear();
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkDelete = async () => {
    const ok = window.confirm('Delete selected inventory items?');

    if (!ok) return;

    try {
      setBulkLoading(true);

      await fetch('/api/admin/inventory/bulk-delete', {
        method: 'PATCH',
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
    return <div className="text-sm text-slate-500">Inventory is empty</div>;
  }

  return (
    <div>
      <BulkSelectionToolbar
        selectedCount={selected.length}
        onClear={clear}
        onBulkReprice={bulkAdd}
      />

      {selected.length > 0 ? (
        <div className="mb-4">
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
                Purchase
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Cost Basis
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Manual Sell
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Qty
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Condition
              </th>
              <th className="border-b border-border bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Est. ROI
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
                      href={`/admin/inventory/${row.id}`}
                      className="font-bold hover:underline"
                    >
                      {row.titleSnapshot || row.itemId}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">{row.itemId}</div>
                  </div>
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.purchasePrice)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.totalCost)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {formatMoney(row.expectedSalePriceManual)}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {row.quantity}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <div className="space-y-1">
                    <div>{row.condition}</div>
                    <StatusPill value={row.sealed ? 'sealed' : 'used'} />
                  </div>
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  {row.expectedSalePriceManual && row.totalCost > 0
                    ? formatPercent(
                        ((row.expectedSalePriceManual - row.totalCost) / row.totalCost) *
                          100,
                      )
                    : '—'}
                </td>

                <td className="border-b border-border px-4 py-4 align-top text-sm text-slate-800">
                  <div className="flex flex-wrap gap-2">
                    <InventoryEditDialog item={row} />
                    <AddToRepriceFlowButton inventoryItemId={row.id} />
                    <InventoryDeleteButton id={row.id} />
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