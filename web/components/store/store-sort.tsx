'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowDownWideNarrow } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export function StoreSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    router.push(`/store/catalog?${params.toString()}`);
  };

  return (
    <div className="relative flex items-center max-w-[240px]">
      <div className="pointer-events-none absolute left-4 text-slate-400">
        <ArrowDownWideNarrow size={18} />
      </div>
      <select
        value={searchParams.get('sort') ?? ''}
        onChange={handleSortChange}
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all hover:bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
      >
        <option value="">{t('sort.newest')}</option>
        <option value="price_asc">{t('sort.priceAsc')}</option>
        <option value="price_desc">{t('sort.priceDesc')}</option>
        <option value="title_asc">{t('sort.nameAsc')}</option>
      </select>
      <div className="pointer-events-none absolute right-4 border-l-4 border-r-4 border-t-[5px] border-l-transparent border-r-transparent border-t-slate-400" />
    </div>
  );
}