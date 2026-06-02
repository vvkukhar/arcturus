'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Vault, TrendingUp, PiggyBank, Loader2, BarChart2, PieChart } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { useState, useMemo } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

export default function VaultPage() {
  const { data: balance, mutate: mutateBalance } = useSWR('/api/proxy/vault/balance', swrFetcher);
  const { data: portfolio, mutate: mutatePortfolio } = useSWR<any>('/api/proxy/vault/portfolio', swrFetcher);
  const { data: deals, mutate: mutateDeals } = useSWR<any[]>('/api/proxy/pro/deals', swrFetcher, { refreshInterval: 15000 });
  
  const [depositAmount, setDepositAmount] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fullOwnership = portfolio?.fullOwnership || [];
  const fractionalOwnership = portfolio?.fractionalOwnership || [];
  const safeDeals = Array.isArray(deals) ? deals : [];

  const chartData = useMemo(() => {
    let runningVal = Number(balance || 0);
    const data = [{ name: 'Init', value: runningVal }];
    
    [...fullOwnership, ...fractionalOwnership].forEach((p: any, i) => {
      if (p.expectedSalePriceManual) {
        runningVal += p.expectedSalePriceManual;
      } else if (p.amount) {
        runningVal += p.amount * 1.35; 
      } else {
        runningVal += p.totalCost;
      }
      data.push({ name: `T+${i + 1}`, value: runningVal });
    });
    
    return data;
  }, [fullOwnership, fractionalOwnership, balance]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingId) return;
    try {
      setLoadingId('deposit');
      const data = await apiFetch<any>('/api/proxy/vault/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(depositAmount) }),
      });
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e.message || 'Deposit failed');
    } finally {
      setLoadingId(null);
    }
  };

  const handleInvest = async (dealId: string, fullPrice: number) => {
    const fractionAmtStr = prompt(`Угода коштує ${fullPrice} ₴. Введіть суму, на яку хочете зайти (мін 500 ₴):`, String(fullPrice));
    if (!fractionAmtStr) return;

    const fractionAmt = Number(fractionAmtStr);
    if (isNaN(fractionAmt) || fractionAmt < 500) {
      toast.error('Сума має бути мінімум 500 ₴');
      return;
    }

    if (loadingId) return;
    try {
      setLoadingId(dealId);
      await apiFetch('/api/proxy/vault/invest', {
        method: 'POST',
        body: JSON.stringify({ dealId, amount: fractionAmt }),
      });
      toast.success('Ви успішно проінвестували в набір!');
      mutateBalance();
      mutatePortfolio();
      mutateDeals();
    } catch (e: any) {
      toast.error(e.message || 'Investment failed');
    } finally {
      setLoadingId(null);
    }
  };

  const projectedYield = fullOwnership.reduce((sum: number, p: any) => sum + ((p.expectedSalePriceManual ?? p.totalCost) - p.totalCost) * 0.8, 0) +
                         fractionalOwnership.reduce((sum: number, f: any) => sum + (f.amount * 0.35) * 0.8, 0);

  return (
    <div className="bg-[#020617] text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-700 pb-24">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/20">
              <Vault size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight font-mono">Arcturus Vault</h1>
              <p className="font-medium text-slate-400 mt-1 uppercase tracking-widest text-xs">Crowdinvesting & Capital Management</p>
            </div>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Liquid Capital</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">{formatMoney(Number(balance || 0))}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-[#0B0F19] border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black flex items-center gap-2">
                <BarChart2 className="text-amber-500" /> Projected NAV
              </h2>
              <div className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded border border-amber-500/20">
                + {formatMoney(projectedYield)} YIELD
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #1E293B' }} itemStyle={{ color: '#F8FAFC', fontWeight: '900', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#0B0F19] border border-slate-800 p-8 rounded-[2rem] shadow-2xl flex-1 flex flex-col justify-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Fund Account</div>
              <form onSubmit={handleDeposit} className="flex flex-col gap-4">
                <input 
                  type="number" 
                  required
                  min="1000"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="Amount (min 1000 ₴)"
                  className="w-full bg-[#131825] border border-slate-700 rounded-xl px-5 py-4 font-bold font-mono outline-none focus:border-amber-500 text-white placeholder-slate-600"
                />
                <button 
                  type="submit"
                  disabled={loadingId === 'deposit' || !depositAmount}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 rounded-xl font-black transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
                >
                  {loadingId === 'deposit' ? <Loader2 className="animate-spin text-black" /> : <PiggyBank />} Deposit Capital
                </button>
              </form>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] flex justify-between items-center">
              <div>
                <div className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-1">Active Positions</div>
                <div className="text-3xl font-black font-mono text-white">{fullOwnership.length + fractionalOwnership.length}</div>
              </div>
              <PieChart className="text-emerald-500 opacity-50" size={48} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black mb-8 border-b border-slate-800 pb-4">Crowdinvesting Deals (Fractional)</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {safeDeals.map(deal => (
            <div key={deal.id} className="bg-[#0B0F19] border border-slate-800 p-6 rounded-[2rem] hover:border-amber-500/50 transition-colors group relative overflow-hidden">
              <div className="font-bold text-lg leading-tight line-clamp-2 mb-6 group-hover:text-amber-400 transition-colors relative z-10">{deal.title}</div>
              <div className="flex justify-between items-center mb-8 bg-[#131825] p-4 rounded-xl border border-slate-800 relative z-10">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Required Capital</div>
                  <div className="text-xl font-black font-mono">{formatMoney(deal.buyPrice)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Est. Return</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">+{formatMoney(deal.profit * 0.8)}</div>
                </div>
              </div>
              <button 
                onClick={() => handleInvest(deal.id, deal.buyPrice)}
                disabled={loadingId === deal.id || Number(balance || 0) < 500}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 border border-slate-700 relative z-10"
              >
                {loadingId === deal.id ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} className="text-amber-500" />} 
                Buy Fractional Share
              </button>
            </div>
          ))}
          {safeDeals.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-[2rem]">
              <div className="text-slate-600 font-mono font-bold uppercase tracking-widest">No active deals match criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}