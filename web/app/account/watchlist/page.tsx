'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Heart, TrendingUp, TrendingDown, Bell, Search } from 'lucide-react';

const watchlist = [
  { id: '75192', name: 'Millennium Falcon', price: '34,500', change: '+1.2%', isUp: true },
  { id: '10305', name: 'Lion Knights\' Castle', price: '16,800', change: '-0.5%', isUp: false },
  { id: '71741', name: 'Ninjago City Gardens', price: '14,200', change: '+2.8%', isUp: true },
  { id: '10294', name: 'Titanic', price: '26,500', change: '0.0%', isUp: true },
];

export default function WatchlistPage() {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('sidebar.watchlist')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Monitoring active assets for potential entry points.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-600/20">
          <Search size={18} /> Add New
        </button>
      </div>

      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
        {watchlist.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-6 border-b border-[var(--border)] last:border-none hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 text-slate-300 group-hover:text-red-500 transition-colors cursor-pointer">
                <Heart size={24} fill={idx === 0 ? 'currentColor' : 'none'} className={idx === 0 ? 'text-red-500' : ''} />
              </div>
              <div>
                <p className="font-black text-lg leading-tight">{item.name}</p>
                <p className="text-xs text-slate-500 font-bold mt-1">ID: {item.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="font-black text-lg">{item.price} ₴</p>
                <p className={`text-xs font-bold flex items-center justify-end gap-1 ${item.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.change}
                </p>
              </div>
              <button className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}