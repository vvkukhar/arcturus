'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ShoppingCart, Eye, Package } from 'lucide-react';
import { SpotlightCard } from '@/components/store/spotlight-card';
import { TiltCard } from '@/components/store/tilt-card';
import { useCart } from '../providers/cart-provider';
import { useState } from 'react';
import { ProductModal } from './product-modal';

type Props = {
  item: any;
};

export function StoreProductCard({ item }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const items = useCart((state) => state.items);
  
  const inCart = items.some((i) => i.id === item.id);
  const price = item.expectedSalePriceManual;
  const isPriced = price != null && price > 0;
  
  const imageUrl = Array.isArray(item.images) && item.images.length > 0
    ? (item.images.find((img: any) => img.isPrimary) ?? item.images[0]).imageUrl
    : item.imageUrl;
  
  const title = item.titleSnapshot || item.item?.title || 'Unknown Product';
  const slug = title.toLowerCase().replaceAll(' ', '-') || item.id;
  const status = (item.quantity ?? 0) > 0 && isPriced ? 'Available' : 'Sold';

  const handleAddToCart = (e: React.MouseEvent) => {
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
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group block h-full outline-none cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <SpotlightCard className="flex h-full flex-col border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900">
            
            <div className="absolute top-4 right-4 z-30 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="relative aspect-square w-full overflow-hidden p-3 z-10">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[var(--background)] transition-colors duration-500 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/20 border border-[var(--border)]">
                {item.sealed && (
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 px-2 py-1 sm:px-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-[10px] sm:text-xs font-black tracking-wider uppercase rounded-md">
                    Sealed
                  </span>
                )}
                
                <div className="absolute bottom-3 right-3 sm:top-4 sm:right-4 sm:bottom-auto z-20 flex flex-row sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-300">
                  <button 
                    onClick={handleAddToCart}
                    disabled={inCart || status !== 'Available'}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-full shadow-lg transition-colors border border-[var(--border)]",
                      inCart || status !== 'Available' 
                        ? "bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed"
                        : "bg-[var(--card)] text-[var(--foreground)] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white"
                    )}
                  >
                    <ShoppingCart size={18} className="w-5 h-5 sm:w-4 sm:h-4" />
                  </button>
                  <div className="hidden sm:flex p-3 bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full shadow-lg transition-colors border border-[var(--border)]">
                    <Eye size={18} />
                  </div>
                </div>

                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-300 dark:text-slate-700">
                    <Package size={48} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-1 flex-col p-6 pt-4 z-10">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    className={cn(
                      'border-transparent shadow-sm px-3 py-1',
                      status === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400')} />
                    {status}
                  </Badge>
                  {item.condition && (
                    <Badge className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-sm px-3 py-1">
                      {item.condition}
                    </Badge>
                  )}
                </div>
                <h3 className="line-clamp-2 text-xl font-black leading-tight text-[var(--foreground)] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {title}
                </h3>
              </div>
              
              <div className="mt-6 flex items-end justify-between border-t border-[var(--border)] pt-4">
                <div className="text-3xl font-black tracking-tighter text-[var(--foreground)]">
                  {isPriced ? formatMoney(price) : 'Request'}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </TiltCard>
      <ProductModal item={item} isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
    </>
  );
}