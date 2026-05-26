// call:function_3{"queries":["web/app/store/catalog/[slug]/page.tsx"]}
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Package, ArrowLeft, ShieldCheck, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { formatMoney } from '@/lib/format';
import { Metadata, ResolvingMetadata } from 'next';
import { AddToCartButton } from './add-to-cart-button';
import { ConversionEngine } from '@/components/store/conversion-engine';
import { ProductPageOfferButton } from './product-page-offer-button';

interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  theme: string;
  sellPrice: number;
  condition: string;
  description: string;
  isAvailable: boolean;
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
  itemId?: string;
  sealed?: boolean;
  seller?: { id: string; name: string };
}

export const revalidate = 60;

async function getProductData(slug: string): Promise<ProductDetail | null> {
  const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog/${encodeURIComponent(slug)}`, {
    next: { tags: [`catalog-item-${slug}`] }
  });
  if (!res.ok) return null;
  return res.json();
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

  return {
    title: `${product.title} | Arcturus Premium LEGO`,
    description: product.description || `Buy authentic ${product.title} (${product.theme}). Condition: ${product.condition}.`,
    openGraph: {
      title: product.title,
      description: `Available now at Arcturus. ${formatMoney(product.sellPrice)}`,
      images: primaryImage ? [{ url: primaryImage }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) notFound();

  const images = product.images || [];
  const displayImage = images.find(img => img.isPrimary)?.imageUrl || images[0]?.imageUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-24 transform-gpu relative">
      
      {/* Декоративний фон для преміальності */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <Link href="/store/catalog" className="relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm font-bold hover:bg-[var(--card)] hover:shadow-md transition-all mb-8 text-[var(--foreground)]">
        <ArrowLeft className="h-4 w-4" />
        Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        {/* ЛІВА ЧАСТИНА - ФОТО */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <div className="relative aspect-square w-full rounded-[3rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-xl">
              {displayImage ? (
                <Image src={displayImage} alt={product.title} fill className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-700" priority sizes="(max-width: 1024px) 100vw, 60vw" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Package className="h-32 w-32" />
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-[var(--foreground)] shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                  {product.theme}
                </span>
                {product.sealed && (
                  <span className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-white shadow-sm border border-blue-500">
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
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight leading-[1.1] mb-6">
              {product.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-bold text-slate-500 uppercase tracking-widest">
                Стан: <span className="ml-1.5 text-[var(--foreground)]">{product.condition}</span>
              </div>
              {product.itemId && (
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                  ID: <span className="ml-1.5 text-[var(--foreground)]">{product.itemId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Вартість набору</div>
            <div className="text-5xl font-black tracking-tighter">
              {product.sellPrice > 0 ? formatMoney(product.sellPrice) : 'Запит ціни'}
            </div>
          </div>

          {/* БЛОК ПРОДАВЦЯ C2C */}
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

          {product.description && (
            <div className="mb-10 space-y-3 bg-[var(--background)] p-6 rounded-[1.5rem] border border-[var(--border)]">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Опис та комплектація</h3>
              <p className="text-[var(--foreground)] font-medium leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-8 w-full">
            <div className="w-full">
              <AddToCartButton product={{
                id: product.id,
                itemId: product.itemId,
                title: product.title,
                price: product.sellPrice,
                imageUrl: displayImage,
                theme: product.theme,
                isAvailable: product.isAvailable
              }} />
            </div>
            
            {product.isAvailable && product.sellPrice > 0 && (
              <div className="w-full">
                <ProductPageOfferButton 
                  inventoryItemId={product.id}
                  productTitle={product.title}
                  currentPrice={product.sellPrice}
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
                <div className="text-xs font-bold text-slate-500">Перевірено</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <Truck className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <div className="text-sm font-black text-[var(--foreground)]">Відправка</div>
                <div className="text-xs font-bold text-slate-500">Протягом 24г</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}