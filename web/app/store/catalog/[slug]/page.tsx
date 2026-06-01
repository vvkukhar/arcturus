// call:function_1{"queries":["web/app/store/catalog/[slug]/page.tsx"]}
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Package, ArrowLeft, ShieldCheck, Truck, User, Info, Hash, Tag, Layers } from 'lucide-react';
import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { formatMoney } from '@/lib/format';
import { Metadata, ResolvingMetadata } from 'next';
import { AddToCartButton } from './add-to-cart-button';
import { ConversionEngine } from '@/components/store/conversion-engine';
import { ProductPageOfferButton } from './product-page-offer-button';
import { cn } from '@/lib/utils';

interface ProductDetail {
  id: string;
  slug: string;
  titleSnapshot: string;
  expectedSalePriceManual?: number | null;
  totalCost?: number | null;
  purchasePrice?: number | null;
  quantity: number;
  condition: string;
  notes?: string | null;
  sealed?: boolean;
  item?: { title: string; theme: string; setNumber: string; kind: string };
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
  itemId?: string;
  seller?: { id: string; name: string };
}

export const revalidate = 60;

async function getProductData(slug: string): Promise<ProductDetail | null> {
  const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog/${encodeURIComponent(slug)}`, {
    next: { tags: [`catalog-item-${slug}`] }
  });
  
  if (!res.ok) return null;
  
  const text = await res.text();
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) return { title: 'Not Found | Arcturus' };

  const images = product.images || [];
  const primaryImage = images.find(img => img.isPrimary)?.imageUrl || images[0]?.imageUrl;
  const price = product.expectedSalePriceManual ?? product.totalCost ?? product.purchasePrice ?? 0;
  const title = product.titleSnapshot || product.item?.title || 'LEGO';

  return {
    title: `${title} | Arcturus Premium LEGO`,
    description: product.notes || `Купити оригінальний ${title} (${product.item?.theme}). Стан: ${product.condition}.`,
    openGraph: {
      title: title,
      description: `Доступно на Arcturus. ${formatMoney(price)}`,
      images: primaryImage ? [{ url: primaryImage }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) notFound();

  const price = product.expectedSalePriceManual ?? product.totalCost ?? product.purchasePrice ?? 0;
  const isAvailable = product.quantity > 0;
  const title = product.titleSnapshot || product.item?.title || 'LEGO Asset';
  const theme = product.item?.theme || 'LEGO';
  const kind = product.item?.kind?.toLowerCase() || 'set';
  
  const kindLabelUA = kind === 'minifigure' ? 'Мініфігурка' : kind === 'bundle' ? 'Лот / Колекція' : kind === 'part' ? 'Деталь' : 'Набір';
  const priceLabelUA = kind === 'minifigure' ? 'Вартість фігурки' : kind === 'bundle' ? 'Вартість лоту' : 'Вартість набору';

  const images = product.images || [];
  const displayImage = images.find(img => img.isPrimary)?.imageUrl || images[0]?.imageUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-700 pb-24 transform-gpu relative">
      
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/3" />
      
      <Link href="/store/catalog" className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-900 hover:scale-105 transition-all mb-10 text-[var(--foreground)] shadow-sm">
        <ArrowLeft className="h-4 w-4" />
        Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        {/* ЛІВА ЧАСТИНА - ФОТО (Завжди світлий студійний фон) */}
        <div className="lg:col-span-7">
          <div className="sticky top-28">
            {/* 🔥 ФІКС: bg-white dark:bg-white фіксує білий фон назавжди */}
            <div className="relative aspect-square w-full rounded-[3rem] border border-[var(--border)] bg-white dark:bg-white overflow-hidden shadow-2xl flex items-center justify-center group transition-colors duration-500">
              
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 z-0 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-200 blur-[100px] rounded-full z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

              {displayImage ? (
                <Image 
                  src={displayImage} 
                  alt={title} 
                  fill 
                  // 🔥 ФІКС: mix-blend-multiply розчинить білий фон JPG картинки
                  className="object-contain p-4 sm:p-8 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out-expo z-10 mix-blend-multiply" 
                  priority 
                  sizes="(max-width: 1024px) 100vw, 60vw" 
                />
              ) : (
                <div className="flex flex-col h-full w-full items-center justify-center text-slate-300 dark:text-slate-400 z-10">
                  <Package className="h-24 w-24 mb-4" strokeWidth={1} />
                  <span className="font-bold uppercase tracking-widest text-xs">Зображення очікується</span>
                </div>
              )}
              
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-xs font-black uppercase tracking-widest text-white shadow-xl border border-white/10">
                  {theme}
                </span>
                {product.sealed && (
                  <span className="inline-flex items-center w-fit px-4 py-2 rounded-xl bg-blue-600/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-white shadow-xl border border-blue-500/50">
                    Sealed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА - ІНФО */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Стан: {product.condition}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight leading-[1.1] mb-6">
              {title}
            </h1>
          </div>

          <div className="mb-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black dark:from-slate-800 dark:to-slate-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Tag size={100} className="transform rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{priceLabelUA}</div>
              <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {price > 0 ? formatMoney(price) : 'Запит ціни'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-[1.5rem] shadow-sm flex items-start gap-4 hover:border-blue-500/30 transition-colors group">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                <Hash size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Артикул</div>
                <div className="font-black text-lg text-[var(--foreground)] leading-tight mt-0.5">{product.item?.setNumber || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-[1.5rem] shadow-sm flex items-start gap-4 hover:border-purple-500/30 transition-colors group">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Тип</div>
                <div className="font-black text-lg text-[var(--foreground)] leading-tight mt-0.5">{kindLabelUA}</div>
              </div>
            </div>
          </div>

          {product.seller && (
            <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-[var(--background)] border border-[var(--border)] mb-8 transition-colors hover:bg-[var(--card)] hover:shadow-md group">
              <div className="w-14 h-14 rounded-[1rem] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Перевірений продавець</div>
                <div className="font-bold text-lg text-[var(--foreground)] leading-tight">{product.seller.name}</div>
              </div>
              <Link href={`/seller/${product.seller.id}`} className="px-5 py-3 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] font-bold rounded-xl text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">
                Профіль
              </Link>
            </div>
          )}

          {product.notes && (
            <div className="mb-10 space-y-3 bg-[var(--card)] p-6 rounded-[1.5rem] border border-[var(--border)] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Info size={16} className="text-blue-500" /> Нотатки колекціонера
              </h3>
              <p className="text-[var(--foreground)] font-medium leading-relaxed whitespace-pre-wrap text-sm">
                {product.notes}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
            <div className="flex-1">
              <AddToCartButton product={{
                id: product.id,
                itemId: product.itemId,
                title: title,
                price: price,
                imageUrl: displayImage,
                theme: theme,
                isAvailable: isAvailable
              }} />
            </div>
            
            {isAvailable && price > 0 && (
              <div className="flex-1">
                <ProductPageOfferButton 
                  inventoryItemId={product.id}
                  productTitle={title}
                  currentPrice={price}
                />
              </div>
            )}
          </div>

          <ConversionEngine itemId={product.id} />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <ShieldCheck className="h-8 w-8 text-blue-500 shrink-0" />
              <div>
                <div className="text-sm font-black text-[var(--foreground)]">Оригінал</div>
                <div className="text-xs font-bold text-slate-500">Перевірено експертами</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <Truck className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <div className="text-sm font-black text-[var(--foreground)]">Відправка</div>
                <div className="text-xs font-bold text-slate-500">Захищене пакування</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}