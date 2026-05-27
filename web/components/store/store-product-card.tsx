'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { SpotlightCard } from '@/components/store/spotlight-card';
import { TiltCard } from '@/components/store/tilt-card';
import { useCart } from '@/lib/store/cart';
import { ProductModal } from './product-modal';

type Props = {
  item: any;
};

function ProductCardComponent({ item }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const items = useCart((state) => state.items);
  
  const inCart = items.some((i) => i.id === item.id);
  const price = item.expectedSalePriceManual ?? item.sellPrice ?? item.totalCost;
  const isPriced = price != null && price > 0;
  
  const imageUrl = Array.isArray(item.images) && item.images.length > 0
    ? (item.images.find((img: any) => img.isPrimary) ?? item.images[0]).imageUrl
    : item.imageUrl;
  
  const title = item.titleSnapshot || item.title || item.item?.title || 'Unknown Product';
  const slug = item.slug;
  const status = (item.quantity ?? 0) > 0 && isPriced ? 'Available' : 'Sold';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart && status === 'Available' && price) {
      addItem({
        id: item.id,
        title: title,
        price,
        imageUrl,
        theme: item.theme,
      });
    }
  };

  return (
    <>
      <TiltCard>
        <Link 
          href={`/store/catalog/${slug}`} 
          className="group block h-full outline-none cursor-pointer"
        >
          <SpotlightCard className="flex h-full flex-col border border-[var(--border)] bg-[var(--card)] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/50 rounded-[2.5rem] overflow-hidden transform-gpu">
            
            <div className="relative aspect-[4/3] sm:aspect-square w-full z-10 bg-white rounded-t-[calc(2.5rem-1px)] overflow-hidden border-b border-[var(--border)]">
              
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                <span className="inline-flex items-center rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  {item.theme}
                </span>
                {item.sealed ? (
                  <span className="inline-flex items-center rounded-xl bg-blue-600/95 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-blue-500/50">
                    Нове / Запечатане
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-xl bg-emerald-600/95 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-emerald-500/50">
                    Вживане / Ідеал
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-300">
                <button 
                  onClick={handleAddToCart}
                  disabled={inCart || status !== 'Available'}
                  className={cn(
                    "p-3 rounded-full shadow-xl transition-all border border-slate-200/50",
                    inCart || status !== 'Available' 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 active:scale-95"
                  )}
                >
                  <ShoppingCart size={18} fill={inCart ? 'currentColor' : 'none'} />
                </button>
              </div>

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-contain p-6 sm:p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Package size={48} />
                </div>
              )}
            </div>
            
            <div className="flex flex-1 flex-col p-6 z-10 bg-[var(--card)]">
              <div className="flex-1">
                <h3 className="line-clamp-2 text-xl font-black leading-tight text-[var(--foreground)] transition-colors group-hover:text-blue-600">
                  {title}
                </h3>
                {item.item?.setNumber && (
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Артикул: {item.item.setNumber}
                  </p>
                )}
              </div>
              
              <div className="mt-6 flex items-end justify-between border-t border-[var(--border)] pt-5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    {status === 'Available' ? 'Доступно' : 'Продано'}
                  </span>
                  <span className="text-3xl font-black tracking-tighter text-[var(--foreground)]">
                    {isPriced ? formatMoney(price) : 'Запит'}
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </Link>
      </TiltCard>
      <ProductModal item={{...item, titleSnapshot: title, expectedSalePriceManual: price, images: imageUrl ? [{ imageUrl, isPrimary: true, id: '1' }] : []}} isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
    </>
  );
}

export const ProductCard = memo(ProductCardComponent, (prev, next) => prev.item.id === next.item.id);