import { SmmBroadcasterPanel } from '@/components/admin/smm-broadcaster-panel';
import { LtvMaximizerPanel } from '@/components/admin/ltv-maximizer-panel';
import { Megaphone } from 'lucide-react';

export default function MarketingHubPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
            <Megaphone className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">AI Marketing Hub</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Automated LTV maximization and Social Media FOMO broadcasting.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SmmBroadcasterPanel />
        <LtvMaximizerPanel />
      </div>
    </div>
  );
}