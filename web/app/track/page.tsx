'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { MapPin, Search, PackageCheck, Loader2, Package } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';

export default function TrackOrderPage() {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<any>(
    activeQuery ? `/api/track/${encodeURIComponent(activeQuery)}` : null,
    swrFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed || trimmed === activeQuery) return;
    setActiveQuery(trimmed);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'approved': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'paid': 
      case 'sold': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'cancelled': 
      case 'rejected': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <MapPin size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">{t('track.title' as any)}</h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('track.subtitle' as any)}
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 md:p-10 rounded-3xl border border-[var(--border)] shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">{t('track.input' as any)}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('track.input' as any)}
                  className="w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-[var(--foreground)] text-base md:text-lg transition-shadow font-medium" 
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-lg mt-2 shadow-xl shadow-blue-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <PackageCheck size={20} />} 
              {t('track.button' as any)}
            </button>
          </form>

          {activeQuery && !isLoading && !error && data && (
            <div className="mt-8 pt-8 border-t border-[var(--border)] animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
                  <Package className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400">{t('common.success' as any)}</div>
                  <div className="text-lg font-black text-[var(--foreground)] leading-tight truncate" title={data.productTitle}>{data.productTitle}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('common.status' as any)}</div>
                  <div className={`inline-flex px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider ${getStatusColor(data.status)}`}>
                    {data.status}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('orderbook.price' as any)}</div>
                  <div className="text-lg font-black text-[var(--foreground)]">
                    {data.sellPrice ? formatMoney(data.sellPrice) : 'Pending'}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('track.input' as any)}</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono truncate" title={data.id}>{data.id}</div>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('common.date' as any)}</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-8 p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-center animate-in fade-in">
              <p className="text-red-600 dark:text-red-400 font-bold">{t('catalog.notfound.title' as any)}</p>
              <p className="text-sm text-red-500/80 mt-1 font-medium">{t('catalog.notfound.desc' as any)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}