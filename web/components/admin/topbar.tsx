'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/admin/command-palette';
import { LogOut, RefreshCcw } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';

export function AdminTopbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch (error) {
      alert('Failed to logout cleanly. Please clear cookies.');
    }
  };

  return (
    <>
      <CommandPalette />
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-xl px-6 py-4">
        <div>
          <div className="text-lg font-black text-slate-900">Arcturus Workspace</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-slate-500">Quick actions:</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-500">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => router.refresh()}
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh Data</span>
          </Button>

          <Button
            variant="outline"
            className="gap-2 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}