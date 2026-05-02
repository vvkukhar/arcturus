'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
type Props = {
 id: string;
};
export function ReserveRequestActions({ id }: Props) {
 const router = useRouter();
 const [loading, setLoading] = useState<string | null>(null);
 const update = async (status: string) => {
  try {
   setLoading(status);
   await fetch('/api/admin/public/reserve/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     id,
     status,
     adminNote: `Updated to ${status} from admin`,
    }),
   });
   router.refresh();
  } finally {
   setLoading(null);
  }
 };
 return (
  <div className="flex flex-wrap gap-2">
   <Button
    className="px-3 py-2 text-xs"
    onClick={() => update('approved')}
   >
    {loading === 'approved' ? 'Saving...' : 'Approve'}
   </Button>
   <Button
    variant="secondary"
    className="px-3 py-2 text-xs"
    onClick={() => update('rejected')}
   >
    {loading === 'rejected' ? 'Saving...' : 'Reject'}
   </Button>
   <Button
    variant="secondary"
    className="px-3 py-2 text-xs"
    onClick={() => update('contacted')}
   >
    {loading === 'contacted' ? 'Saving...' : 'Contacted'}
   </Button>
  </div>
 );
}