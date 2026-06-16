'use client';

import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { Activity, TrendingUp, TrendingDown, DollarSign, Package, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { ProGate } from '@/components/store/pro-gate';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

interface HistoryData {
  date?: string;
  month?: string;
  revenue: number | string;
}

interface CatalogItem {
  itemId: string;
  totalCost: number;
  expectedSalePriceManual?: number;
  titleSnapshot: string;
  item?: { setNumber: string };
}

interface PortfolioSummary {
  inventory?: { expectedRevenue: number; inventoryItems: number };
  sales?: { totalRevenue: number };
}

const parseVal = (val: string | number | undefined): number => {
  if (val === undefined) return 0;
  return typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0 : val;
};

export default function MarketPage() {
  const { t } = useI18n();
  
  const { data: historyData, isLoading: hLoading } = useSWR<HistoryData[]>('/api/profit/monthly', swrFetcher);
  const { data: catalogData, isLoading: cLoading } = useSWR<CatalogItem[]>('/api/proxy/public/catalog?limit=10', swrFetcher);
  const { data: stats, isLoading: sLoading } = useSWR<PortfolioSummary>('/api/portfolio/summary', swrFetcher);

  if (hLoading || cLoading || sLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  const chartData = Array.isArray(historyData) ? historyData.map(d => ({
    time: d.date || d.month,
    value: parseVal(d.revenue)
  })) : [];

  const movers = Array.isArray(catalogData) ? catalogData
    .map(item => {
      const cost = item.totalCost || 1;
      const price = item.expectedSalePriceManual ?? cost;
      const change = ((price - cost) / cost) * 100;
      return {
        id: item.item?.setNumber || item.itemId.slice(0, 6),
        name: item.titleSnapshot,
        price: formatMoney(price),
        change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        up: change >= 0,
        rawChange: change
      };
    })
    .sort((a, b) => Math.abs(b.rawChange) - Math.abs(a.rawChange))
    .slice(0, 5) : [];

  const marketCap = stats?.inventory?.expectedRevenue ?? 0;
  const realizedRevenue = stats?.sales?.totalRevenue ?? 0;
  const activeListings = stats?.inventory?.inventoryItems ?? 0;

  return (
    <ProGate>
      <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('market.title' as any)}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('market.subtitle' as any)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Activity size={24} />
              </div>
              <span className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-md">
                <TrendingUp size={14} /> {t('market.active' as any)}
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{t('market.globalCap' as any)}</h3>
            <p className="text-3xl font-black">{formatMoney(marketCap)}</p>
          </div>
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
                <DollarSign size={24} />
              </div>
              <span className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-md">
                <TrendingUp size={14} /> {t('market.growth' as any)}
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{t('market.tradingVol' as any)}</h3>
            <p className="text-3xl font-black">{formatMoney(realizedRevenue)}</p>
          </div>
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl">
                <Package size={24} />
              </div>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{t('market.activePos' as any)}</h3>
            <p className="text-3xl font-black">{activeListings}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-xl font-black mb-6">{t('market.chartTitle' as any)}</h2>
            <div className="h-[400px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIndex)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium">{t('market.noData' as any)}</div>
              )}
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-black">{t('market.topMovers' as any)}</h2>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
              {movers.length > 0 ? movers.map((mover, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-sm line-clamp-1">{mover.name}</p>
                    <p className="text-xs text-slate-500 font-medium">ID #{mover.id}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="font-black text-sm">{mover.price}</p>
                    <p className={`text-xs font-bold flex items-center justify-end gap-1 ${mover.up ? 'text-green-500' : 'text-red-500'}`}>
                      {mover.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {mover.change}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-400 font-medium">{t('market.noMovers' as any)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProGate>
  );
}