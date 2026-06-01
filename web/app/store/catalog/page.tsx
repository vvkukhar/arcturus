// call:function_1{"queries":["web/app/store/catalog/page.tsx"]}
import { Metadata } from 'next';
import { Blocks } from 'lucide-react';
import { ProductCard } from '@/components/store/store-product-card';
import { CatalogFilters } from '@/components/store/catalog-filters';
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

  const initialQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const initialTheme = typeof resolvedParams.theme === 'string' ? resolvedParams.theme : '';
  const initialType = typeof resolvedParams.type === 'string' ? resolvedParams.type : '';

  try {
    const query = new URLSearchParams();
    query.set('availableOnly', 'true');
    
    if (initialQuery) query.set('q', initialQuery);
    if (initialTheme) query.set('theme', initialTheme);
    if (initialType) query.set('type', initialType);

    const [catalogRes, themesRes] = await Promise.all([
      fetch(`${appConfig.apiBaseUrl}/public/catalog?${query.toString()}`, { cache: 'no-store' }),
      fetch(`${appConfig.apiBaseUrl}/public/themes`, { cache: 'no-store' })
    ]);

    if (catalogRes.ok) {
      const data = await catalogRes.json();
      items = Array.isArray(data) ? data : [];
    }

    if (themesRes.ok) {
      const data = await themesRes.json();
      themes = Array.isArray(data) ? data : [];
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
          
          <CatalogFilters themes={themes} initialQuery={initialQuery} initialTheme={initialTheme} initialType={initialType} />
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item: any) => {
            const safeTitle = item.titleSnapshot || item.item?.title || 'Arcturus Custom Item';
            const baseSlug = String(safeTitle)
              .trim()
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s-]/gu, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
            
            // 🔥 ФІКС ТУТ: використовуємо -id- замість --
            const safeSlug = `${baseSlug}-id-${item.id}`;
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