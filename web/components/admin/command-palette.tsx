'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Wallet, ScanSearch, RefreshCw, Handshake, LayoutDashboard } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  const actions = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'inventory', label: 'Go to Inventory', icon: Package, href: '/admin/inventory' },
    { id: 'watchlist', label: 'Go to Watchlist', icon: Wallet, href: '/admin/watchlist' },
    { id: 'scanner', label: 'Open Scanner', icon: ScanSearch, href: '/admin/scanner' },
    { id: 'sync', label: 'Sync Center', icon: RefreshCw, href: '/admin/sync' },
    { id: 'collab', label: 'Collaboration', icon: Handshake, href: '/admin/collaboration' },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/40 pt-[15vh] backdrop-blur-sm" 
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-100 px-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands... (Esc to close)"
            className="w-full bg-transparent px-4 py-5 text-base font-medium outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                onClick={() => {
                  setOpen(false);
                  router.push(action.href);
                }}
              >
                <Icon className="h-5 w-5 text-slate-400" />
                <span className="font-semibold">{action.label}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">
              No results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}