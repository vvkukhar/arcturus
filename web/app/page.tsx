'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, PackageSearch, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/magnetic';
import { useI18n } from '@/components/providers/i18n-provider';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-transparent flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply pointer-events-none animate-float delay-300" />

      <header className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">ARCTURUS</span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/store/catalog" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.catalog')}
          </Link>
          <Button href="/store/catalog" className="rounded-full px-6 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40">
            {t('landing.btn')}
          </Button>
        </nav>
      </header>

      <section className="relative flex-1 flex flex-col justify-center px-6 pt-40 pb-24 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/50 backdrop-blur-xl px-5 py-2 text-xs font-black tracking-[0.2em] text-blue-600 uppercase mb-8 shadow-sm animate-fade-in-up">
            <ShieldCheck size={16} />
            {t('landing.badge')}
          </div>
          
          <h1 className="text-6xl sm:text-[7rem] font-black tracking-tighter text-slate-900 leading-[1.05] animate-fade-in-up delay-100">
            {t('landing.title1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {t('landing.title2')}
            </span>
          </h1>
          
          <p className="mt-8 mx-auto max-w-2xl text-xl sm:text-2xl text-slate-600 leading-relaxed font-medium animate-fade-in-up delay-200">
            {t('landing.desc')}
          </p>
          
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up delay-300">
            <Magnetic>
              <Button href="/store/catalog" size="lg" className="w-full sm:w-auto group rounded-[2rem] h-16 px-10 text-lg bg-slate-900 hover:bg-black transition-all">
                {t('landing.btn')}
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="mt-32 max-w-6xl mx-auto grid gap-6 md:grid-cols-3 animate-fade-in-up delay-300">
          {[
            { icon: ShieldCheck, color: 'blue', title: 'landing.feat1.title', desc: 'landing.feat1.desc' },
            { icon: PackageSearch, color: 'indigo', title: 'landing.feat2.title', desc: 'landing.feat2.desc' },
            { icon: Zap, color: 'purple', title: 'landing.feat3.title', desc: 'landing.feat3.desc' }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="group rounded-[2.5rem] border border-white/40 bg-white/40 backdrop-blur-3xl p-10 shadow-lg transition-all hover:-translate-y-2 hover:bg-white/60 hover:shadow-xl">
                <div className={`h-14 w-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center text-${feature.color}-600 mb-6 transition-transform group-hover:scale-110`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{t(feature.title as any)}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {t(feature.desc as any)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}