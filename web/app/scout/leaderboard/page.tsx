'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Trophy, Target, ShieldCheck, Loader2 } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';

interface Scout {
  id: string;
  name: string;
  points: number;
  rank: string;
  successfulLeads: number;
  totalLeads: number;
}

export default function LeaderboardPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<Scout[]>('/api/proxy/gamification/leaderboard', swrFetcher);
  const scouts = Array.isArray(data) ? data : [];

  const getRankColor = (rank: string) => {
    if (rank === 'Master Scout') return 'text-amber-500 bg-amber-50 border-amber-200';
    if (rank === 'Pro Hunter') return 'text-purple-500 bg-purple-50 border-purple-200';
    return 'text-blue-500 bg-blue-50 border-blue-200';
  };

  return (
    <main className="min-h-screen py-16 px-4 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--card)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[1.5rem] flex items-center justify-center shadow-lg text-white">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('scout.hall.title' as any)}</h1>
              <p className="text-slate-500 font-medium mt-1">{t('scout.hall.desc' as any)}</p>
            </div>
          </div>
          <Link href="/scout" className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-md">
            {t('scout.hall.suggest' as any)}
          </Link>
        </div>

        <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-amber-500 w-10 h-10" />
            </div>
          ) : scouts.length === 0 ? (
            <div className="py-20 text-center text-slate-500 font-medium">
              {t('scout.hall.empty' as any)}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {scouts.map((scout, index) => (
                <div key={scout.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="w-12 text-center font-black text-2xl text-slate-300">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-lg text-[var(--foreground)]">{scout.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getRankColor(scout.rank)}`}>
                        {scout.rank}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1"><Target size={14}/> {scout.totalLeads} {t('scout.hall.leads' as any)}</span>
                      <span className="flex items-center gap-1 text-emerald-500"><ShieldCheck size={14}/> {scout.successfulLeads} {t('scout.hall.bought' as any)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-2xl text-amber-500">{formatMoney(scout.points).replace('₴','')} pts</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('scout.hall.score' as any)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}