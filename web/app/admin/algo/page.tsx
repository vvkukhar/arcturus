'use client';

import { useState } from 'react';
import { BrainCircuit, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { SectionCard } from '@/components/admin/section-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function AlgoControlPage() {
  const [pricingAggressiveness, setPricingAggressiveness] = useState(50);
  const [minRoiTarget, setMinRoiTarget] = useState(35);
  const [autoBuyLimit, setAutoBuyLimit] = useState(15000);
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await apiFetch('/api/proxy/algo/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          pricingAggressiveness,
          minRoiTarget,
          autoBuyLimit,
          isAutoPilotActive,
        }),
      });
      toast.success('Algorithmic parameters deployed to workers successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to deploy parameters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Algorithmic Control</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Manage automated trading bots and dynamic pricing engines.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[var(--background)] px-5 py-3 rounded-2xl border border-[var(--border)]">
          <div className={`h-3 w-3 rounded-full animate-pulse ${isAutoPilotActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="font-bold text-sm uppercase tracking-wider">{isAutoPilotActive ? 'Auto-Pilot Active' : 'Manual Override'}</span>
          <button 
            onClick={() => setIsAutoPilotActive(!isAutoPilotActive)}
            className="ml-4 text-xs font-black text-blue-600 hover:underline"
          >
            Toggle
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Dynamic Pricing Engine">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pricing Aggressiveness</label>
                <span className="font-black text-indigo-600">{pricingAggressiveness}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={pricingAggressiveness} 
                onChange={(e) => setPricingAggressiveness(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-500 font-medium">Higher values maximize profit margin at the cost of liquidity speed.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Target ROI Ceiling</label>
                <span className="font-black text-emerald-600">{minRoiTarget}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={minRoiTarget} 
                onChange={(e) => setMinRoiTarget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-xs text-slate-500 font-medium">The target ROI threshold the pricing bot will attempt to maintain.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Automated Procurement">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Auto-Buy Capital Limit (UAH)</label>
                <span className="font-black text-blue-600">{new Intl.NumberFormat('uk-UA').format(autoBuyLimit)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="1000"
                value={autoBuyLimit} 
                onChange={(e) => setAutoBuyLimit(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 font-medium">Maximum capital the bot can commit to purchase queues per day.</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 flex gap-4">
              <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-300">Risk Management Active</h4>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">The bot will automatically halt procurement if market volatility exceeds 45% or confidence drops below 0.5.</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleSave} disabled={loading} className="gap-2 rounded-[1rem] px-10">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {loading ? 'Deploying...' : 'Deploy Parameters'}
        </Button>
      </div>
    </div>
  );
}