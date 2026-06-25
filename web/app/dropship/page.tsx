'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Package, TrendingUp, Search, Loader2, Store, Truck } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { ProGate } from '@/components/store/pro-gate';
import Image from 'next/image';
import { DropshipCheckoutModal } from '@/components/dropship/dropship-checkout-modal';
import { useI18n } from '@/components/providers/i18n-provider';

interface WholesaleItem {
  id: string;
  title: string;
  theme: string;
  wholesalePrice: number;
  recommendedRetailPrice: number;
  profitMargin: number;
  quantity: number;
  imageUrl?: string;
}

export default function DropshipB2bPage() {
  const { t } = useI18n();
  const { data, isLoading, mutate } = useSWR<WholesaleItem[]>('/api/proxy/dropship/catalog', swrFetcher);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WholesaleItem | null>(null);

  const items = Array.isArray(data) ? data : [];
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.theme.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ProGate>
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 dark:bg-black p-8 rounded-[3rem] shadow-2xl mb-10 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none"><Truck size={200} /></div>
          <div className="relative z-10 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-black uppercase tracking-widest mb-4 border border-indigo-500/30">
              <Store size={14} /> Zero-Touch Fulfillment
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{t('dropship.title' as any)}</h1>
            <p className="text-slate-400 font-medium max-w-xl">{t('dropship.subtitle' as any)}</p>
          </div>

          <div className="relative z-10 w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('dropship.search' as any)}
              className="w-full bg-black/50 border border-slate-700 text-white rounded-2xl pl-12 pr-4 py-4 font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[var(--card)] border border-[var(--border)] rounded-[3rem]">
            <Package size={64} className="text-slate-300 mb-6" />
            <h2 className="text-2xl font-black text-[var(--foreground)]">{t('dropship.noItems' as any)}</h2>
            <p className="text-slate-500 font-medium">{t('dropship.emptySub' as any)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all group flex flex-col h-full">
                <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-6 border border-[var(--border)]">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt="" fill className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={40} /></div>
                  )}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-md">
                    B2B {item.quantity > 0 ? `${item.quantity} шт` : '0 шт'}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.theme}</div>
                  <h3 className="font-bold text-lg leading-tight text-[var(--foreground)] mb-6 line-clamp-2">{item.title}</h3>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 line-through">Ринок: {formatMoney(item.recommendedRetailPrice)}</div>
                        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none mt-1">{formatMoney(item.wholesalePrice)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('dropship.profit' as any)}</div>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><TrendingUp size={16} /> {formatMoney(item.profitMargin)}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="w-full py-4 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-black rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {t('dropship.sendToClient' as any)} <Truck size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedItem && (
          <DropshipCheckoutModal 
            isOpen={!!selectedItem} 
            onClose={() => { setSelectedItem(null); mutate(); }} 
            item={selectedItem} 
          />
        )}
      </div>
    </ProGate>
  );
}