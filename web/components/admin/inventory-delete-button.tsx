'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
type Props = {
 id: string;
};
export function InventoryDeleteButton({ id }: Props) {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 return (
  <Button
   variant="secondary"
   className="px-3 py-2 text-xs"
   onClick={async () => {
    const ok = window.confirm('Delete inventory item?');
    if (!ok) return;
    try {
     setLoading(true);
     await fetch('/api/admin/inventory/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
     });
     router.refresh();
    } finally {
     setLoading(false);
    }
   }}
  >
   {loading ? 'Deleting...' : 'Delete'}
  </Button>
 );
}