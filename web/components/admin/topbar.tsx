'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/admin/command-palette';

export function AdminTopbar() {
  const router = useRouter();

  return (
    <>
      <CommandPalette />
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <div>
          <div className="text-lg font-black">Arcturus Control Center</div>
          <div className="text-sm text-slate-500">
            Press <kbd className="rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">вЊ˜K</kbd> to search
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
    </>
  );
}