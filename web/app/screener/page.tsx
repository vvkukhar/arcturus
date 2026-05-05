'use client';

import { useEffect, useState, useMemo } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { Filter, Search, Download, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { formatMoney } from '@/lib/format';

export default function ScreenerPage() {
  const { t } = useI18n();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [sort, setSort] = useState('roi_desc');

  useEffect(() => {
    let mounted = true;
    apiFetch<any[]>('/api/public/catalog?limit=200')
      .then((res) => {
        if (mounted) {
          setData(Array.isArray(res) ? res : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const themes = useMemo(() => {
    const set = new Set<string>();
    data.forEach(item => {
      if (item.item?.theme) set.add(item.item.theme);
    });
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
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
      const aRoi = a.totalCost > 0 ? (((a.expectedSalePriceManual ?? a.totalCost) - a.totalCost) / a.totalCost) * 100 : 0;
      const bRoi = b.totalCost > 0 ? (((b.expectedSalePriceManual ?? b.totalCost) - b.totalCost) / b.totalCost) * 100 : 0;
      
      if (sort === 'roi_desc') return bRoi - aRoi;
      if (sort === 'roi_asc') return aRoi - bRoi;
      if (sort === 'price_desc') return (b.expectedSalePriceManual ?? b.totalCost) - (a.expectedSalePriceManual ?? a.totalCost);
      if (sort === 'price_asc') return (a.expectedSalePriceManual ?? a.totalCost) - (b.expectedSalePriceManual ?? b.totalCost);
      return 0;
    });

    return result;
  }, [data, query, themeFilter, sort]);

  const exportCSV = () => {
    const headers = ['Set ID', 'Name', 'Theme', 'Cost Basis', 'Market Target', 'Est. ROI'];
    const csvData = filtered.map(row => {
      const cost = row.totalCost || 0;
      const target = row.expectedSalePriceManual ?? cost;
      const roi = cost > 0 ? ((target - cost) / cost) * 100 : 0;
      return [
        row.item?.setNumber || row.itemId.slice(0,8),
        `"${row.titleSnapshot}"`,
        row.item?.theme || '—',
        cost,
        target,
        `${roi.toFixed(2)}%`
      ].join(',');
    });
    
    const blob = new Blob([[headers.join(','), ...csvData].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screener_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto h-full flex flex-col animate-fade-in-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('screener.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('screener.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm">
            <Download size={16} /> Export CSV
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
            placeholder="Search by ID or Name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" 
          />
        </div>
        <select 
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-[var(--border)] text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        >
          <option value="">All Themes</option>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-[var(--border)] text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        >
          <option value="roi_desc">Highest ROI</option>
          <option value="roi_asc">Lowest ROI</option>
          <option value="price_desc">Highest Price</option>
          <option value="price_asc">Lowest Price</option>
        </select>
        <button onClick={() => { setQuery(''); setThemeFilter(''); setSort('roi_desc'); }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-colors">
          <Filter size={14} /> Clear Filters
        </button>
      </div>

      <div className="bg-[var(--card)] border-x border-b border-[var(--border)] rounded-b-2xl shadow-sm overflow-x-auto flex-1 min-h-[400px]">
        {loading ? (
          <div className="flex h-full items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center py-20 text-slate-500 font-medium">
            No assets match your criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-black">Set ID / Item ID</th>
                <th className="p-4 font-black">Name</th>
                <th className="p-4 font-black">Theme</th>
                <th className="p-4 font-black">Cost Basis</th>
                <th className="p-4 font-black">Market Target</th>
                <th className="p-4 font-black text-right">Est. ROI</th>
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
                    <td className="p-4 font-bold">{row.titleSnapshot}</td>
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