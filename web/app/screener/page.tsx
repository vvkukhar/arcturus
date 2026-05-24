'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { Filter, Search, Download, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { ProGate } from '@/components/store/pro-gate';

interface ScreenerItem {
  id: string;
  itemId: string;
  titleSnapshot: string;
  totalCost: number;
  expectedSalePriceManual?: number;
  item?: { theme?: string; setNumber?: string };
}

export default function ScreenerPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [sort, setSort] = useState('roi_desc');

  const { data: rawData, isLoading } = useSWR<ScreenerItem[]>('/api/proxy/public/catalog?limit=500', swrFetcher);
  const data = Array.isArray(rawData) ? rawData : [];

  const themes = useMemo(() => {
    const set = new Set<string>();
    for (const item of data) {
      if (item.item?.theme) set.add(item.item.theme);
    }
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...data];

    if (query) {
      const lower = query.toLowerCase();
      result = result.filter(r => 
        r.titleSnapshot?.toLowerCase().includes(lower) || 
        r.item?.setNumber?.toLowerCase().includes(lower) ||
        r.id.toLowerCase().includes(lower)
      );
    }

    if (themeFilter) {
      result = result.filter(r => r.item?.theme === themeFilter);
    }

    result.sort((a, b) => {
      const aCost = a.totalCost || 1;
      const bCost = b.totalCost || 1;
      const aTarget = a.expectedSalePriceManual ?? aCost;
      const bTarget = b.expectedSalePriceManual ?? bCost;
      
      const aRoi = ((aTarget - aCost) / aCost) * 100;
      const bRoi = ((bTarget - bCost) / bCost) * 100;
      
      if (sort === 'roi_desc') return bRoi - aRoi;
      if (sort === 'roi_asc') return aRoi - bRoi;
      if (sort === 'price_desc') return bTarget - aTarget;
      if (sort === 'price_asc') return aTarget - bTarget;
      return 0;
    });

    return result;
  }, [data, query, themeFilter, sort]);

  const exportCSV = () => {
    const headers = [
      t('screener.col.id' as any), 
      t('screener.col.name' as any), 
      t('screener.col.theme' as any), 
      t('screener.col.cost' as any), 
      t('screener.col.target' as any), 
      t('screener.col.roi' as any)
    ];
    
    const csvData = filtered.map(row => {
      const cost = row.totalCost || 0;
      const target = row.expectedSalePriceManual ?? cost;
      const roi = cost > 0 ? ((target - cost) / cost) * 100 : 0;
      return [
        row.item?.setNumber || row.itemId.slice(0,8),
        `"${(row.titleSnapshot || '').replace(/"/g, '""')}"`,
        row.item?.theme || '—',
        cost,
        target,
        `${roi.toFixed(2)}%`
      ].join(',');
    });
    
    const blob = new Blob([[headers.join(','), ...csvData].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcturus_screener_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto h-full flex flex-col animate-fade-in-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('screener.title' as any)}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('screener.subtitle' as any)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm">
            <Download size={16} /> {t('screener.export' as any)}
          </button>
        </div>
      </div>

      <div className="bg-[var(--card)] p-4 rounded-t-2xl border border-[var(--border)] shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('screener.search' as any)} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
          />
        </div>
        <select 
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors"
        >
          <option value="">{t('screener.theme' as any)}: {t('screener.allThemes' as any)}</option>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border-none text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors"
        >
          <option value="roi_desc">{t('screener.highestRoi' as any)}</option>
          <option value="roi_asc">{t('screener.lowestRoi' as any)}</option>
          <option value="price_desc">{t('screener.highestPrice' as any)}</option>
          <option value="price_asc">{t('screener.lowestPrice' as any)}</option>
        </select>
        <button onClick={() => { setQuery(''); setThemeFilter(''); setSort('roi_desc'); }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-colors">
          <Filter size={14} /> {t('screener.clearFilters' as any)}
        </button>
      </div>

      <div className="bg-[var(--card)] border-x border-b border-[var(--border)] rounded-b-2xl shadow-sm overflow-x-auto flex-1 min-h-[400px] custom-scrollbar">
        {isLoading ? (
          <div className="flex h-full items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center py-20 text-slate-500 font-medium">
            {t('screener.noAssets' as any)}
          </div>
        ) : (
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-black">{t('screener.col.id' as any)}</th>
                <th className="p-4 font-black">{t('screener.col.name' as any)}</th>
                <th className="p-4 font-black">{t('screener.col.theme' as any)}</th>
                <th className="p-4 font-black">{t('screener.col.cost' as any)}</th>
                <th className="p-4 font-black">{t('screener.col.target' as any)}</th>
                <th className="p-4 font-black text-right">{t('screener.col.roi' as any)}</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filtered.map((row) => {
                const cost = row.totalCost || 0;
                const target = row.expectedSalePriceManual ?? cost;
                const roi = cost > 0 ? ((target - cost) / cost) * 100 : 0;
                return (
                  <tr key={row.id} className="border-b border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 text-blue-600 dark:text-blue-400 font-bold">{row.item?.setNumber || row.itemId.slice(0,8)}</td>
                    <td className="p-4 font-bold truncate max-w-[300px]" title={row.titleSnapshot}>{row.titleSnapshot}</td>
                    <td className="p-4 text-slate-500">{row.item?.theme || '—'}</td>
                    <td className="p-4 text-slate-500">{formatMoney(cost)}</td>
                    <td className="p-4 font-bold">{formatMoney(target)}</td>
                    <td className={`p-4 text-right font-black ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}