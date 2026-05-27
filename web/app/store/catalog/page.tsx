import { Metadata } from 'next';
import { Filter, Search, Blocks } from 'lucide-react';
import { ProductCard } from '@/components/store/store-product-card';
import { appConfig } from '@/lib/config';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Catalog | Arcturus Premium LEGO',
  description: 'Browse our curated selection of rare, retired, and authenticated LEGO sets.',
};

type Props = {
  params: Promise<any>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CatalogPage(props: Props) {
  const resolvedParams = await props.searchParams;
  
  let items: any[] = [];
  let themes: string[] = [];

  try {
    const query = new URLSearchParams();
    query.set('availableOnly', 'true');
    
    if (typeof resolvedParams.q === 'string') query.set('q', resolvedParams.q);
    if (typeof resolvedParams.theme === 'string') query.set('theme', resolvedParams.theme);

    const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog?${query.toString()}`, {
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      items = Array.isArray(data) ? data : [];
      themes = Array.from(new Set(items.map((i: any) => i?.item?.theme || 'LEGO').filter(Boolean))).sort() as string[];
    }
  } catch (err) {
    console.error('Catalog fetch error:', err);
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500 transform-gpu min-h-screen">
      
      <div className="relative mb-12 rounded-[3rem] bg-gradient-to-br from-slate-900 to-black dark:from-slate-900 dark:to-slate-950 p-8 sm:p-12 overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:items-end">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-widest mb-6">
              <Blocks size={14} /> Arcturus Collection
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
              Преміальний <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Каталог</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Знайдіть ідеальний сет для своєї колекції. Всі набори перевірені та готові до відправки.
            </p>
          </div>
          
          <form method="GET" action="/store/catalog" className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto shrink-0 bg-white/5 backdrop-blur-md p-3 rounded-[2rem] border border-white/10 shadow-xl">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input 
                name="q"
                defaultValue={typeof resolvedParams.q === 'string' ? resolvedParams.q : ''}
                placeholder="Пошук наборів..." 
                className="h-14 w-full rounded-2xl border-none bg-white/10 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-400 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex-1 sm:w-56">
              <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                name="theme"
                defaultValue={typeof resolvedParams.theme === 'string' ? resolvedParams.theme : ''}
                className="h-14 w-full appearance-none rounded-2xl border-none bg-white/10 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="" className="text-black">Усі серії</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme} className="text-black">{theme}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30">
              Знайти
            </button>
          </form>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((item: any) => {
            const safeTitle = item.titleSnapshot || item.item?.title || 'Arcturus Custom Item';
            const baseSlug = String(safeTitle)
              .trim()
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s-]/gu, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
            
            const safeSlug = `${baseSlug}--${item.id}`;
            
            const safeImage = item.images?.[0]?.imageUrl || item.imageUrl || item.item?.imageUrl || '';
            
            return (
              <ProductCard 
                key={item.id} 
                item={{
                  ...item,
                  title: safeTitle,
                  theme: item.item?.theme || 'LEGO',
                  sellPrice: item.expectedSalePriceManual ?? item.totalCost ?? item.purchasePrice ?? 0,
                  slug: safeSlug,
                  imageUrl: safeImage,
                }} 
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-32 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <Blocks className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Нічого не знайдено</h3>
          <p className="mt-3 text-lg font-medium text-slate-500 max-w-md">На жаль, за вашими критеріями немає вільних наборів. Спробуйте змінити фільтри.</p>
          <Link href="/store/catalog" className="mt-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 text-sm font-black transition-transform hover:scale-105 active:scale-95 shadow-xl">
            Скинути пошук
          </Link>
        </div>
      )}
    </div>
  );
}