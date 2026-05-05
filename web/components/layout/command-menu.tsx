'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, User, ShoppingCart, MapPin, X, LineChart, ShieldCheck } from 'lucide-react';
import { useCart } from '../providers/cart-provider';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setIsCartOpen } = useCart();

  const commands = [
    { name: 'Catalog', path: '/store/catalog', icon: Package, category: 'Navigation' },
    { name: 'Market Overview', path: '/market', icon: LineChart, category: 'Trading' },
    { name: 'Account Dashboard', path: '/account', icon: User, category: 'Account' },
    { name: 'Order Tracking', path: '/track', icon: MapPin, category: 'Navigation' },
    { name: 'Authenticity Checks', path: '/authenticity', icon: ShieldCheck, category: 'Information' },
  ];

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    return commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !open);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  if (!open) return null;

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search size={20} className="text-slate-400 mr-3 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium"
          />
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">No results found for "{query}"</div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <button 
                    key={idx}
                    onClick={() => navigate(cmd.path)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="group-hover:text-white" />
                      <span className="font-bold">{cmd.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase opacity-40 group-hover:opacity-100">{cmd.category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}