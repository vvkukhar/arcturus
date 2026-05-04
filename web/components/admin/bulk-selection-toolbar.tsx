'use client';

import { Button } from '@/components/ui/button';
import { MousePointerSquareDashed, X } from 'lucide-react';

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
  if (selectedCount <= 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-blue-200 bg-blue-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <MousePointerSquareDashed className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900">{selectedCount} items selected</div>
          <div className="text-xs font-medium text-slate-500">Apply actions to multiple items at once</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onBulkPurchase && (
          <Button size="sm" onClick={onBulkPurchase} className="bg-blue-600 hover:bg-blue-700 text-white">
            Add to Purchase Flow
          </Button>
        )}
        
        {onBulkReprice && (
          <Button size="sm" onClick={onBulkReprice} className="bg-blue-600 hover:bg-blue-700 text-white">
            Add to Reprice Flow
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={onClear} className="gap-2 text-slate-500 hover:text-slate-900">
          <X className="h-4 w-4" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
}