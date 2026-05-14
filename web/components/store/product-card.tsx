'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { useCart } from '@/lib/store/cart';

interface ProductCardProps {
  item: {
    id: string;
    slug: string;
    title: string;
    theme: string;
    sellPrice: number;
    condition: string;
    images: { imageUrl: string; isPrimary: boolean }[];
  };
}

function ProductCardComponent({ item }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const inCart = useCart((state) => state.items.some((i) => i.id === item.id));
  
  const primaryImage = item.images.find((img) => img.isPrimary)?.imageUrl || item.images[0]?.imageUrl;

  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      addItem({
        id: item.id,
        title: item.title,
        price: item.sellPrice,
        imageUrl: primaryImage,
        theme: item.theme,
      });
    }
  }, [inCart, addItem, item, primaryImage]);

  return (
    <Link 
      href={`/store/catalog/${item.slug}`} 
      prefetch={false}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 transform-gpu"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={item.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-700">
            <Package className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-lg bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] shadow-sm backdrop-blur-md dark:bg-black/90">
            {item.theme}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-[var(--foreground)] transition-colors group-hover:text-blue-600">
            {item.title}
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            {item.condition}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            {formatMoney(item.sellPrice)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            aria-label={inCart ? "Item in cart" : "Add to cart"}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all will-change-transform ${
              inCart 
                ? 'cursor-not-allowed bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95'
            }`}
          >
            <ShoppingCart className="h-5 w-5" fill={inCart ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent, (prev, next) => prev.item.id === next.item.id);