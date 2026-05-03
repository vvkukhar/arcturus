import Link from 'next/link';
import { Gem } from 'lucide-react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Gem className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
            <span className="text-xl font-black tracking-tight text-slate-900">ARCTURUS</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-bold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Головна
            </Link>
            <Link href="/store/catalog" className="text-blue-600 hover:text-blue-700 transition-colors">
              Каталог
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}