// call:function_2{"queries":["web/components/store/store-product-card.tsx"]}
'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ShoppingCart, Eye, Package } from 'lucide-react';
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
  
  const slug = String(title)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

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
          <SpotlightCard className="flex h-full flex-col border border-[var(--border)] bg-[var(--card)] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900 rounded-[2.5rem]">
            
            <div className="absolute top-4 right-4 z-30 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
                <ArrowUpRight size={20} />
              </div>
            </div>

            {/* ФІКС: Зменшено відступ (p-2 sm:p-4) для більшого розміру картинки */}
            <div className="relative aspect-square w-full overflow-hidden z-10 bg-white border-b border-[var(--border)]">
              {item.sealed && (
                <span className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-blue-100/90 text-blue-800 text-[10px] sm:text-xs font-black tracking-wider uppercase rounded-xl backdrop-blur-md shadow-sm border border-blue-200">
                  Sealed
                </span>
              )}
              
              <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-300">
                <button 
                  onClick={handleAddToCart}
                  disabled={inCart || status !== 'Available'}
                  className={cn(
                    "p-3 rounded-full shadow-lg transition-colors border border-slate-200",
                    inCart || status !== 'Available' 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  )}
                >
                  <ShoppingCart size={18} />
                </button>
                <div className="hidden sm:flex p-3 bg-white text-slate-900 hover:bg-slate-900 hover:text-white rounded-full shadow-lg transition-colors border border-slate-200">
                  <Eye size={18} />
                </div>
              </div>

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-contain p-2 sm:p-4 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-300">
                  <Package size={48} />
                </div>
              )}
            </div>
            
            <div className="flex flex-1 flex-col p-6 z-10 bg-[var(--card)]">
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
              
              <div className="mt-6 flex items-end justify-between border-t border-[var(--border)] pt-5">
                <div className="text-3xl font-black tracking-tighter text-[var(--foreground)]">
                  {isPriced ? formatMoney(price) : 'Запит'}
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