'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Check, Trash2 } from 'lucide-react';

type Props = {
  id: string;
  selectedPrice: number | null;
};

export function PurchaseFlowActions({ id, selectedPrice }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'bought' | 'remove' | null>(null);

  const handleMarkBought = async () => {
    // Даємо змогу оператору підтвердити фінальну ціну покупки
    const price = prompt('Confirm final purchase price (UAH):', String(selectedPrice || 0));
    if (price === null) return;
    
    try {
      setLoading('bought');
      await apiFetch('/api/proxy/flows/purchase/mark-bought', {
        method: 'PATCH',
        body: JSON.stringify({
          id,
          purchasePrice: Number(price),
          quantity: 1
        }),
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to mark as bought');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove from purchase flow?')) return;
    try {
      setLoading('remove');
      await apiFetch('/api/proxy/flows/purchase/remove', {
        method: 'PATCH',
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleMarkBought} disabled={loading !== null}>
        {loading === 'bought' ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
        Mark Bought
      </Button>
      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={handleRemove} disabled={loading !== null}>
        {loading === 'remove' ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
        Remove
      </Button>
    </div>
  );
}