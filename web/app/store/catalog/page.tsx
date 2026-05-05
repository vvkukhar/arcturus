'use client';

import { ProductCard } from '@/components/store/product-card';
import { InventoryItem } from '@/lib/types';
import { PackageSearch, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';
import { useEffect, useState, useMemo } from 'react';

export default function CatalogPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTheme, setFilterTheme] = useState('');
  const [filterCondition, setFilterCondition] = useState('');

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/public/catalog`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchTheme = !filterTheme || item.titleSnapshot.toLowerCase().includes(filterTheme.toLowerCase());
      const matchCondition = !filterCondition || item.condition === filterCondition;
      return matchTheme && matchCondition;
    });
  }, [items, filterTheme, filterCondition]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('catalog.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('catalog.subtitle')}</p>
      </div>

      <div className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm mb-10 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 font-bold px-2 border-r border-[var(--border)] pr-6 mr-2">
          <SlidersHorizontal size={18} className="text-blue-600" />
          {t('catalog.filters')}
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="">{t('catalog.theme')}: {t('catalog.all')}</option>
            <option value="Star Wars">Star Wars</option>
            <option value="Ninjago">Ninjago</option>
            <option value="Technic">Technic</option>
          </select>

          <select 
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="">{t('catalog.condition')}: {t('catalog.all')}</option>
            <option value="NEW">{t('catalog.new')}</option>
            <option value="USED">{t('catalog.used')}</option>
          </select>
        </div>

        {filterTheme || filterCondition ? (
          <button 
            onClick={() => { setFilterTheme(''); setFilterCondition(''); }}
            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline ml-auto pr-4"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="font-bold text-slate-400">Loading Terminal Data...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-xl font-bold">{t('catalog.empty.title')}</h3>
          <p className="text-slate-500 mt-2 font-medium">{t('catalog.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}