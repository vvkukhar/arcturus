'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Wallet, ScanSearch, RefreshCw, Handshake, LayoutDashboard, X } from 'lucide-react';

const ACTIONS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { id: 'inventory', label: 'Manage Inventory', icon: Package, href: '/admin/inventory' },
  { id: 'watchlist', label: 'Manage Watchlist', icon: Wallet, href: '/admin/watchlist' },
  { id: 'scanner', label: 'Open Scanner', icon: ScanSearch, href: '/admin/scanner' },
  { id: 'sync', label: 'Sync Center', icon: RefreshCw, href: '/admin/sync' },
  { id: 'collab', label: 'Collaboration', icon: Handshake, href: '/admin/collaboration' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [open]);

  if (!open) return null;

  const filtered = ACTIONS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/40 pt-[15vh] backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-100 px-5">
          <Search className="h-5 w-5 text-blue-600" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands... (Esc to close)"
            className="w-full bg-transparent px-4 py-5 text-base font-medium outline-none placeholder:text-slate-400 text-slate-900"
          />
          <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-3">
          {filtered.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-blue-50 focus:bg-blue-50 focus:outline-none group"
                onClick={() => {
                  setOpen(false);
                  router.push(action.href);
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{action.label}</span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-sm font-medium text-slate-500">
              No results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}