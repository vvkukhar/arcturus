'use client';

import Link from 'next/link';
import { Target, Vault, Truck, Network, ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export default function EcosystemPage() {
  const { t } = useI18n();
  const pathways = [
    {
      id: 'scout',
      title: 'Bounty & Scouts',
      desc: t('scout.subtitle' as any),
      icon: Target,
      href: '/scout',
      color: 'from-orange-500 to-rose-500',
      bg: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      id: 'vault',
      title: 'Arcturus Vault',
      desc: t('vault.subtitle' as any),
      icon: Vault,
      href: '/vault',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'dropship',
      title: 'B2B Dropship',
      desc: t('dropship.subtitle' as any),
      icon: Truck,
      href: '/dropship',
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'syndicate',
      title: 'The Syndicate',
      desc: t('syndicate.subtitle' as any),
      icon: Network,
      href: '/syndicate',
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <main className="min-h-screen py-16 md:py-24 px-4 relative overflow-hidden bg-[var(--background)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-[var(--foreground)]">
          {t('ecosystem.title1' as any)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{t('ecosystem.title2' as any)}</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          {t('pro.subtitle' as any)}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 relative z-10">
        {pathways.map((p) => {
          const Icon = p.icon;
          return (
            <Link 
              key={p.id} 
              href={p.href}
              className={`group p-8 rounded-[2.5rem] border ${p.bg} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg mb-6 text-white`}>
                <Icon size={32} />
              </div>
              <h2 className="text-2xl font-black text-[var(--foreground)] mb-3">{p.title}</h2>
              <p className="text-slate-500 font-medium flex-1 mb-8 text-lg leading-relaxed">{p.desc}</p>
              <div className="flex items-center gap-2 font-bold text-[var(--foreground)] group-hover:gap-4 transition-all">
                {t('common.add' as any).replace('+', '')} <ArrowRight size={20} />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}