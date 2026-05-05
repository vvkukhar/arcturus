'use client';

import { ProductCard } from '@/components/store/product-card';
import { InventoryItem } from '@/lib/types';
import { PackageSearch, Filter } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';
import { useEffect, useState } from 'react';

export default function CatalogPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('catalog.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg font-medium">{t('catalog.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-wrap items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold px-2">
          <Filter size={18} />
          {t('catalog.filters')}:
        </div>
        <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm">
          <option value="">{t('catalog.theme')} (All)</option>
          <option value="Star Wars">Star Wars</option>
          <option value="Ninjago">Ninjago</option>
          <option value="Technic">Technic</option>
        </select>
        <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm">
          <option value="">{t('catalog.condition')} (All)</option>
          <option value="NEW">New (Sealed)</option>
          <option value="USED">Used (Complete)</option>
        </select>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('catalog.empty.title')}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('catalog.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}