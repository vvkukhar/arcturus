'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Filter, Search, Download, ChevronDown } from 'lucide-react';

const screenerData = [
  { id: '75192', theme: 'Star Wars', name: 'UCS Millennium Falcon', year: 2017, parts: 7541, msrp: '$849.99', market: '$920.00', roi: '+8.2%' },
  { id: '10305', theme: 'Icons', name: 'Lion Knights\' Castle', year: 2022, parts: 4514, msrp: '$399.99', market: '$385.00', roi: '-3.7%' },
  { id: '71741', theme: 'Ninjago', name: 'Ninjago City Gardens', year: 2021, parts: 5685, msrp: '$349.99', market: '$410.00', roi: '+17.1%' },
  { id: '21330', theme: 'Ideas', name: 'Home Alone', year: 2021, parts: 3955, msrp: '$299.99', market: '$315.00', roi: '+5.0%' },
  { id: '75313', theme: 'Star Wars', name: 'UCS AT-AT', year: 2021, parts: 6785, msrp: '$849.99', market: '$860.00', roi: '+1.1%' },
  { id: '71799', theme: 'Ninjago', name: 'Ninjago City Markets', year: 2023, parts: 6163, msrp: '$369.99', market: '$380.00', roi: '+2.7%' },
];

export default function ScreenerPage() {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('screener.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('screener.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--card)] p-4 rounded-t-2xl border border-[var(--border)] shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by ID or Name..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl font-bold text-sm">
          Theme <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl font-bold text-sm">
          Year <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl font-bold text-sm">
          ROI % <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md">
          <Filter size={14} /> Apply Filters
        </button>
      </div>

      <div className="bg-[var(--card)] border-x border-b border-[var(--border)] rounded-b-2xl shadow-sm overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-black">Set ID</th>
              <th className="p-4 font-black">Name</th>
              <th className="p-4 font-black">Theme</th>
              <th className="p-4 font-black">Year</th>
              <th className="p-4 font-black">Parts</th>
              <th className="p-4 font-black">MSRP</th>
              <th className="p-4 font-black">Market Price</th>
              <th className="p-4 font-black text-right">ROI (All Time)</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {screenerData.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="p-4 text-blue-600 dark:text-blue-400 font-bold">{row.id}</td>
                <td className="p-4 font-bold">{row.name}</td>
                <td className="p-4 text-slate-500">{row.theme}</td>
                <td className="p-4 text-slate-500">{row.year}</td>
                <td className="p-4 text-slate-500">{row.parts}</td>
                <td className="p-4">{row.msrp}</td>
                <td className="p-4 font-bold">{row.market}</td>
                <td className={`p-4 text-right font-black ${row.roi.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {row.roi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}