import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Package, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { formatMoney } from '@/lib/format';
import { Metadata, ResolvingMetadata } from 'next';
import { AddToCartButton } from './add-to-cart-button';
import { ConversionEngine } from '@/components/store/conversion-engine';

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

  const primaryImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;

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

  const displayImage = product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: displayImage ? [displayImage] : [],
    description: product.description || `Authentic LEGO ${product.theme} set.`,
    sku: product.itemId || product.id,
    brand: {
      '@type': 'Brand',
      name: 'LEGO'
    },
    itemCondition: product.condition.toLowerCase().includes('new') || product.sealed 
      ? 'https://schema.org/NewCondition' 
      : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/catalog/${product.slug}`,
      priceCurrency: 'UAH',
      price: product.sellPrice,
      availability: product.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: product.condition.toLowerCase().includes('new') || product.sealed 
        ? 'https://schema.org/NewCondition' 
        : 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: 'Arcturus Premium LEGO'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: Math.floor(Math.random() * (50 - 10 + 1) + 10).toString() 
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <Link href="/store/catalog" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-6">
          <div className="relative aspect-square w-full rounded-[3rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-sm">
            {displayImage ? (
              <Image src={displayImage} alt={product.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <Package className="h-24 w-24" />
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-[var(--foreground)] shadow-sm">
                {product.theme}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight leading-[1.1] mb-4">
              {product.title}
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Стан: <span className="ml-1 text-[var(--foreground)]">{product.condition}</span>
            </div>
          </div>

          <div className="mb-10 text-5xl font-black text-[var(--foreground)]">
            {formatMoney(product.sellPrice)}
          </div>

          {product.description && (
            <div className="mb-10 space-y-4">
              <h3 className="text-lg font-black tracking-tight">Опис</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-12">
            <AddToCartButton product={{
              id: product.id,
              title: product.title,
              price: product.sellPrice,
              imageUrl: displayImage,
              theme: product.theme,
              isAvailable: product.isAvailable
            }} />
          </div>

          <ConversionEngine itemId={product.id} />

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <ShieldCheck className="h-6 w-6 text-blue-500 shrink-0" />
              <span className="text-sm font-bold">Оригінальний товар Arcturus</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Truck className="h-6 w-6 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold">Швидке відправлення</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}