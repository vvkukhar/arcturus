'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AdminTopbar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <div>
        <div className="text-lg font-black">Arcturus Control Center</div>
        <div className="text-sm text-slate-500">
          Inventory, opportunities, flows, operator layer
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            router.refresh();
          }}
        >
          Refresh View
        </Button>

        <Button
          variant="secondary"
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}