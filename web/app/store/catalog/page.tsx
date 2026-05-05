'use client';

import { ProductCard } from '@/components/store/product-card';
import { InventoryItem } from '@/lib/types';
import { PackageSearch } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('catalog.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{t('catalog.subtitle')}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('catalog.empty.title')}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('catalog.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}