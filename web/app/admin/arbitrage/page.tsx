'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Globe, Plane, TrendingUp } from 'lucide-react';
import { SectionCard } from '@/components/admin/section-card';
import { DataTable } from '@/components/admin/data-table';
import { formatMoney, formatPercent } from '@/lib/format';
import { StatusPill } from '@/components/admin/status-pill';

interface ArbitrageRow {
  id: string;
  title: string;
  url: string;
  priceOriginal: number;
  currency: string;
  baseUah: number;
  totalLandedUah: number;
  taxUah: number;
  shippingUah: number;
  localSellPrice: number;
  netProfit: number;
  roi: number;
  action: string;
}

export default function ArbitrageRadarPage() {
  const { data: rows, isLoading } = useSWR<ArbitrageRow[]>('/api/admin/arbitrage', swrFetcher);
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Global Arbitrage</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Cross-border opportunities calculated with landed costs and customs taxes.</p>
          </div>
        </div>
      </div>

      <SectionCard title="Cross-Border Deals Radar">
        <DataTable
          rows={safeRows}
          emptyText={isLoading ? "Scanning global markets..." : "No profitable import arbitrage opportunities found right now."}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'item',
              header: 'Asset',
              render: (row) => (
                <div className="flex flex-col max-w-[250px]">
                  <span className="font-black text-[var(--foreground)] truncate" title={row.title}>{row.title}</span>
                  <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 flex items-center gap-1">
                    View Source Listing <Plane size={12} />
                  </a>
                </div>
              ),
            },
            {
              key: 'priceOriginal',
              header: 'Foreign Price',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{row.priceOriginal} {row.currency}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 mt-1">~{formatMoney(row.baseUah)}</span>
                </div>
              ),
            },
            {
              key: 'landed',
              header: 'Landed Cost (UA)',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-black text-rose-600 dark:text-rose-400">{formatMoney(row.totalLandedUah)}</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">Tax: {formatMoney(row.taxUah)} | Ship: {formatMoney(row.shippingUah)}</span>
                </div>
              ),
            },
            {
              key: 'local',
              header: 'Local Value',
              render: (row) => <span className="font-black text-[var(--foreground)]">{formatMoney(row.localSellPrice)}</span>,
            },
            {
              key: 'profit',
              header: 'Net Arbitrage',
              render: (row) => (
                <div className="flex flex-col items-start">
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{formatMoney(row.netProfit)}</span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-1">
                    <TrendingUp size={10} /> {formatPercent(row.roi)}
                  </span>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Signal',
              render: (row) => <StatusPill value={row.action} />,
            }
          ]}
        />
      </SectionCard>
    </div>
  );
}