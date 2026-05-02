'use client';

import { Button } from '@/components/ui/button';

type Props = {
  selectedCount: number;
  onClear: () => void;
  onBulkPurchase?: () => void;
  onBulkReprice?: () => void;
};

export function BulkSelectionToolbar({
  selectedCount,
  onClear,
  onBulkPurchase,
  onBulkReprice,
}: Props) {
  if (selectedCount <= 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white p-4">
      <div className="text-sm font-bold">{selectedCount} selected</div>
      {onBulkPurchase ? (
        <Button className="px-3 py-2 text-xs" onClick={onBulkPurchase}>
          Add Selected to Purchase Flow
        </Button>
      ) : null}
      {onBulkReprice ? (
        <Button className="px-3 py-2 text-xs" onClick={onBulkReprice}>
          Add Selected to Reprice Flow
        </Button>
      ) : null}
      <Button variant="secondary" className="px-3 py-2 text-xs" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}