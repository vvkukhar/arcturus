'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Calculator, Info, Search, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';

interface CompSummary {
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
  count: number;
}

export default function ValuationPage() {
  const { t } = useI18n();
  const [setId, setSetId] = useState('');
  const [condition, setCondition] = useState('Sealed (Mint)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ price: number; liquidity: string; confidence: number } | null>(null);

  const handleValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !setId.trim()) return;

    setLoading(true);
    setResult(null);
    
    try {
      const data = await apiFetch<CompSummary>('/api/comps/summary', {
        method: 'POST',
        body: JSON.stringify({ setNumber: setId.trim() }),
      });

      if (!data || data.count === 0 || !data.median) {
        toast.error((t('valuation.errorNoData' as any) as string));
        return;
      }

      const liquidity = data.count >= 10 ? 'High' : data.count >= 4 ? 'Moderate' : 'Low';
      let confidence = data.count >= 10 ? 98.5 : data.count >= 4 ? 82.0 : 45.0;
      
      let finalPrice = data.median;
      if (condition.includes('Used')) {
        finalPrice *= 0.75;
        confidence *= 0.9;
      } else if (condition.includes('Damaged')) {
        finalPrice *= 0.85;
      }

      setResult({
        price: finalPrice,
        liquidity,
        confidence,
      });

      toast.success((t('valuation.success' as any) as string));
    } catch (err) {
      toast.error((t('valuation.errorFetch' as any) as string));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('valuation.title' as any) as string}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('valuation.subtitle' as any) as string}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleValuation} className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm transition-colors">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-[var(--foreground)]">
              <Calculator size={20} className="text-blue-600" />
              {t('valuation.estimator' as any) as string}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('valuation.setId' as any) as string}</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    value={setId}
                    onChange={(e) => setSetId(e.target.value)}
                    placeholder={t('valuation.setIdPlaceholder' as any) as string} 
                    className="w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-shadow text-[var(--foreground)]" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('valuation.condition' as any) as string}</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full p-4 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors">
                    <option value="Sealed (Mint)">{t('valuation.cond.sealedMint' as any) as string}</option>
                    <option value="Sealed (Damaged)">{t('valuation.cond.sealedDamaged' as any) as string}</option>
                    <option value="Used (Complete)">{t('valuation.cond.used' as any) as string}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('valuation.status' as any) as string}</label>
                  <select className="w-full p-4 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors">
                    <option value="Retired">{t('valuation.stat.retired' as any) as string}</option>
                    <option value="Active Retail">{t('valuation.stat.active' as any) as string}</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading || !setId.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                {t('valuation.calculate' as any) as string}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={`transition-all duration-500 ${result ? 'opacity-100 scale-100' : 'opacity-50 scale-95 grayscale'}`}>
            <div className="bg-slate-900 dark:bg-blue-600 text-white p-8 rounded-3xl shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">{t('valuation.fairPrice' as any) as string}</p>
                <ShieldCheck size={24} />
              </div>
              <p className="text-5xl font-black mb-2">{result ? formatMoney(result.price) : '--- ₴'}</p>
              <p className="text-sm font-medium opacity-80">{t('valuation.fairPriceDesc' as any) as string}</p>
              
              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">{t('valuation.liquidity' as any) as string}</p>
                  <p className="font-black">{result ? result.liquidity : '---'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">{t('valuation.confidence' as any) as string}</p>
                  <p className="font-black">{result ? `${result.confidence.toFixed(1)}%` : '---'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm transition-colors">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 shrink-0" />
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {result 
                  ? (t('valuation.infoSuccess' as any) as string).replace('{id}', setId)
                  : (t('valuation.infoDefault' as any) as string)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}