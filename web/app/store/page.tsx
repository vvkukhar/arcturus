import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export const metadata = {
  title: 'Premium LEGO Store | Arcturus',
  description: 'Exclusive access to rare, retired, and authenticated LEGO sets.',
};

export default function StoreHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full bg-slate-900 dark:bg-black text-white py-24 sm:py-32 overflow-hidden hardware-accelerated">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 dark:from-blue-900/20 dark:via-black dark:to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-tight">
              Rare LEGO.<br />Real Stock.<br />Right Now.
            </h1>
            <p className="text-xl text-slate-300 mb-10 font-medium">
              Stop hunting for retired sets on shady marketplaces. We authenticate, verify parts, and ship fast. What you see is what you get.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/store/catalog" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
                Shop Catalog <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-[var(--border)] bg-[var(--background)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--foreground)]">100% Authenticated</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Every piece is verified original LEGO.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--foreground)]">Fast Delivery</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Shipped securely within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--foreground)]">Real-Time Inventory</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">If you can add it to cart, it's in stock.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-[var(--foreground)] mb-8">Ready to build?</h2>
          <Link href="/store/catalog" className="inline-block px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-transform hover:scale-105 shadow-xl">
            View All Inventory
          </Link>
        </div>
      </section>
    </div>
  );
}