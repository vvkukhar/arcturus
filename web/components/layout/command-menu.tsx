'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, User, ShoppingCart, MapPin, X } from 'lucide-react';
import { useI18n } from '../providers/i18n-provider';
import { useCart } from '../providers/cart-provider';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { t } = useI18n();
  const { setIsCartOpen } = useCart();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const openCart = () => {
    setOpen(false);
    setIsCartOpen(true);
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
            placeholder="Search sets, themes, or commands..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium"
          />
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider">
            ESC
          </div>
          <button onClick={() => setOpen(false)} className="sm:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <div className="px-3 py-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Suggestions</div>
          <div className="space-y-1">
            <button onClick={() => navigate('/store/catalog?theme=Star+Wars')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <Search size={18} className="text-blue-500" /> Star Wars Catalog
            </button>
            <button onClick={() => navigate('/store/catalog?theme=Ninjago')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <Search size={18} className="text-blue-500" /> Ninjago Collection
            </button>
          </div>

          <div className="px-3 py-2 mt-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick Actions</div>
          <div className="space-y-1">
            <button onClick={() => navigate('/store/catalog')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <Package size={18} className="text-slate-400" /> View All Inventory
            </button>
            <button onClick={openCart} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <ShoppingCart size={18} className="text-slate-400" /> Open Cart
            </button>
            <button onClick={() => navigate('/track')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <MapPin size={18} className="text-slate-400" /> Track Order
            </button>
            <button onClick={() => navigate('/account')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors text-left font-bold">
              <User size={18} className="text-slate-400" /> Account Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}