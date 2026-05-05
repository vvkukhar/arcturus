'use client';

import { ProductCard } from '@/components/store/product-card';
import { InventoryItem } from '@/lib/types';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
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
          <select className="bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">{t('catalog.theme')}: {t('catalog.all')}</option>
            <option>Star Wars</option>
            <option>Ninjago</option>
            <option>Technic</option>
          </select>

          <select className="bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">{t('catalog.condition')}: {t('catalog.all')}</option>
            <option value="NEW">{t('catalog.new')}</option>
            <option value="USED">{t('catalog.used')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-xl font-bold">{t('catalog.empty.title')}</h3>
          <p className="text-slate-500 mt-2 font-medium">{t('catalog.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}