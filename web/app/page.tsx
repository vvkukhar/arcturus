import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, PackageSearch, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <Gem className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-black tracking-tighter text-slate-900">ARCTURUS</span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/store/catalog" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Каталог
          </Link>
          <Button href="/store/catalog" size="sm" className="rounded-full px-6 shadow-md hover:shadow-lg">
            До покупок
          </Button>
        </nav>
      </header>

      <section className="relative flex-1 flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-700 uppercase mb-8 shadow-sm">
            <ShieldCheck size={16} />
            Верифіковані набори та мініфігурки
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Ексклюзивний <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              LEGO трейдинг
            </span>
          </h1>
          
          <p className="mt-8 mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed font-medium">
            Колекційні набори, раритетні мініфігурки та лімітовані серії. 
            Кожна деталь проходить сувору перевірку на оригінальність.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/store/catalog" size="lg" className="w-full sm:w-auto group rounded-2xl h-16 px-10 text-lg">
              Відкрити каталог
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div className="mt-32 max-w-6xl mx-auto grid gap-8 md:grid-cols-3 relative z-10">
          <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-8 shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Абсолютна гарантія</h3>
            <p className="text-slate-600 leading-relaxed">
              Ми особисто перевіряємо кожен набір. Жодних підробок, лише 100% оригінальний LEGO.
            </p>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-8 shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
              <PackageSearch size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Рідкісні екземпляри</h3>
            <p className="text-slate-600 leading-relaxed">
              Доступ до закритого інвентарю наборів, які вже давно зняті з виробництва.
            </p>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-8 shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Швидке бронювання</h3>
            <p className="text-slate-600 leading-relaxed">
              Моментальний резерв обраних позицій прямо з каталогу в один клік.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}