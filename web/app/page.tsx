import Link from 'next/link';
import { ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 opacity-70" />
      
      <div className="mx-auto max-w-4xl relative z-10 w-full">
        <div className="rounded-[2.5rem] border border-white/50 bg-white/70 backdrop-blur-xl p-12 sm:p-16 shadow-soft text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-widest text-blue-700 uppercase mb-8 shadow-sm">
            Arcturus OS
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            LEGO trading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              operating system
            </span>
          </h1>
          
          <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed">
            Admin workflows, market opportunities, sync health, operator review,
            and a highly-converting public storefront on top of a single, powerful backend.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/admin/dashboard" size="lg" className="w-full sm:w-auto group">
              <LayoutDashboard className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Open Admin
            </Button>
            <Button href="/store" variant="secondary" size="lg" className="w-full sm:w-auto group">
              <ShoppingBag className="mr-2 h-5 w-5 text-slate-500 transition-colors group-hover:text-slate-900" />
              Storefront Stub
              <ArrowRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}