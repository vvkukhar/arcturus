'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import type { ReserveStatus, ApiResponse } from '@/lib/types';

type Props = {
  id: string;
  currentStatus: string;
};

export function ReserveRequestActions({ id, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<ReserveStatus | null>(null);

  const updateStatus = async (status: ReserveStatus) => {
    if (currentStatus === status) return;
    
    try {
      setLoading(status);
      await apiFetch<ApiResponse<any>>('/api/admin/public/reserve/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id,
          status,
          adminNote: `Status updated to ${status} via Admin Panel`,
        }),
      });
      router.refresh();
    } catch (error) {
      alert(`Failed to update status to ${status}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={!!loading || currentStatus === 'approved'}
        onClick={() => updateStatus('approved')}
        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[90px]"
      >
        {loading === 'approved' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={!!loading || currentStatus === 'rejected'}
        onClick={() => updateStatus('rejected')}
        className="min-w-[80px]"
      >
        {loading === 'rejected' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={!!loading || currentStatus === 'contacted'}
        onClick={() => updateStatus('contacted')}
        className="min-w-[95px]"
      >
        {loading === 'contacted' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Contacted'}
      </Button>
    </div>
  );
}