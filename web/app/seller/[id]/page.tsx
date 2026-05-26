import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Package, ShieldCheck, User, Star, TrendingUp } from 'lucide-react';
import { appConfig } from '@/lib/config';
import { ProductCard } from '@/components/store/product-card';

export const revalidate = 60;

async function getSellerProfile(id: string) {
  const res = await fetch(`${appConfig.apiBaseUrl}/public/seller/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getSellerProfile(resolvedParams.id);

  if (!data) notFound();

  const { seller, stats, listings } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 transform-gpu min-h-screen">
      
      {/* Шапка профілю */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-8 md:p-12 mb-12 shadow-sm flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center shrink-0 border-4 border-[var(--background)] shadow-xl">
          <User size={64} className="text-indigo-500" />
        </div>

        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">{seller.name}</h1>
            <ShieldCheck className="text-blue-500 w-8 h-8" />
          </div>
          <p className="text-slate-500 font-medium text-lg mb-8">
            На платформі з {new Date(seller.createdAt).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] px-5 py-3 rounded-2xl">
              <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Успішних угод</div>
                <div className="text-xl font-black text-[var(--foreground)] leading-tight">{stats.soldCount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] px-5 py-3 rounded-2xl">
              <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
                <Star size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Рейтинг</div>
                <div className="text-xl font-black text-[var(--foreground)] leading-tight">5.0 <span className="text-sm text-slate-400 font-medium">/ 5</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Товари продавця */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-slate-400" size={24} />
          <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Товари продавця ({stats.activeListings})</h2>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item: any) => {
              const safeTitle = item.titleSnapshot || item.item?.title || 'Unknown Item';
              const safeSlug = String(safeTitle).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
              const safeImage = item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80';
              
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
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] py-20 text-center">
            <span className="mb-4 text-6xl opacity-50" aria-hidden="true">🛒</span>
            <h3 className="text-xl font-black text-[var(--foreground)]">Немає активних товарів</h3>
            <p className="mt-2 font-medium text-slate-500">Зараз у цього продавця немає виставлених наборів.</p>
          </div>
        )}
      </div>
    </div>
  );
}