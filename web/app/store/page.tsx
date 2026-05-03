import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StorefrontPage() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white p-10 sm:p-16 shadow-soft text-center sm:text-left flex flex-col items-center sm:items-start">
      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold tracking-widest text-slate-600 uppercase mb-8 shadow-sm">
        <ShieldCheck size={14} className="text-blue-500" />
        Verified Storefront
      </div>

      <h1 className="max-w-4xl text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
        Premium LEGO Resale <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Powered by Arcturus.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Browse curated, verified inventory. Reserve exclusive sets and minifigures instantly. 
        Direct integration with our advanced operator network ensures quality and speed.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10">
        <Button href="/store/catalog" size="lg" className="w-full sm:w-auto group">
          <Search className="mr-2 h-5 w-5 opacity-70" />
          Browse Catalog
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <Button href="/admin/dashboard" variant="secondary" size="lg" className="w-full sm:w-auto">
          Admin Control
        </Button>
      </div>
    </section>
  );
}