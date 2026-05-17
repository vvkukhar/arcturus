import { Metadata } from 'next';
import { Filter, Search } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import { appConfig } from '@/lib/config';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Catalog | Arcturus Premium LEGO',
  description: 'Browse our curated selection of rare, retired, and authenticated LEGO sets.',
};

// ЗВЕРНИ УВАГУ: Тепер searchParams — це Promise (вимога Next.js 15+)
export default async function CatalogPage(props: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 transform-gpu">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">Каталог</h1>
          <p className="mt-2 font-medium text-slate-500">Знайдіть ідеальний сет для своєї колекції.</p>
        </div>
        
        <form method="GET" action="/store/catalog" className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              name="q"
              defaultValue={typeof resolvedParams.q === 'string' ? resolvedParams.q : ''}
              placeholder="Пошук..." 
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-4 text-sm font-medium outline-none transition-shadow focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              name="theme"
              defaultValue={typeof resolvedParams.theme === 'string' ? resolvedParams.theme : ''}
              onChange={(e) => e.target.form?.submit()}
              className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-4 text-sm font-medium outline-none transition-shadow focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Усі серії</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item: any) => {
            const safeTitle = item.titleSnapshot || item.item?.title || 'Arcturus Custom Item';
            const safeSlug = String(safeTitle).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const safeImage = item.imageUrl || item.item?.imageUrl || 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80';
            
            return (
              <ProductCard 
                key={item.id || Math.random()} 
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
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] py-20 text-center">
          <span className="mb-4 text-6xl" aria-hidden="true">🧱</span>
          <h3 className="text-xl font-black text-[var(--foreground)]">Нічого не знайдено</h3>
          <p className="mt-2 font-medium text-slate-500">Спробуйте змінити критерії пошуку.</p>
          <Link href="/store/catalog" className="mt-6 rounded-xl bg-blue-50 px-6 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
            Скинути фільтри
          </Link>
        </div>
      )}
    </div>
  );
}