'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Calculator, Info, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function ValuationPage() {
  const { t } = useI18n();
  const [valuation, setValuation] = useState({
    fairPrice: '34,500',
    liquidity: 'High',
    confidence: '98%',
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('valuation.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('valuation.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              Price Estimator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Set ID</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="e.g. 75192" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Condition</label>
                  <select className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl font-bold outline-none">
                    <option>Sealed (Mint)</option>
                    <option>Sealed (Damaged)</option>
                    <option>Used (Complete)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Inventory Age</label>
                  <select className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-xl font-bold outline-none">
                    <option>Retired</option>
                    <option>Active Retail</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20">
                Calculate Fair Value
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 dark:bg-blue-600 text-white p-8 rounded-3xl shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <p className="text-sm font-bold uppercase tracking-widest opacity-70">Arcturus Fair Price</p>
              <ShieldCheck size={24} />
            </div>
            <p className="text-5xl font-black mb-2">{valuation.fairPrice} ₴</p>
            <p className="text-sm font-medium opacity-80">Estimated market value for a mint sealed set.</p>
            
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Liquidity</p>
                <p className="font-black">{valuation.liquidity}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Confidence</p>
                <p className="font-black">{valuation.confidence}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 shrink-0" />
              <p className="text-sm text-slate-500 font-medium">
                Our model uses recent sales data from major marketplaces and internal inventory turnover rates to estimate liquidity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}