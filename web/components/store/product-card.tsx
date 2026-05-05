'use client';

import { useState } from 'react';
import { InventoryItem } from '@/lib/types';
import { useCart } from '../providers/cart-provider';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import { ProductModal } from './product-modal';

export function ProductCard({ item }: { item: InventoryItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();
  
  const price = item.expectedSalePriceManual ?? item.totalCost;
  const imageUrl = item.images?.[0]?.imageUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      title: item.titleSnapshot,
      price,
      imageUrl,
    });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
      >
        <div className="aspect-square bg-slate-50 dark:bg-slate-900 relative p-4 sm:p-6 flex items-center justify-center">
          {item.sealed && (
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2 py-1 sm:px-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-[10px] sm:text-xs font-black tracking-wider uppercase rounded-md">
              Sealed
            </span>
          )}
          
          <div className="absolute bottom-3 right-3 sm:top-4 sm:right-4 sm:bottom-auto z-10 flex flex-row sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-300">
            <button 
              onClick={handleAddToCart}
              className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-full shadow-lg transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ShoppingCart size={18} className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button 
              className="hidden sm:flex p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 rounded-full shadow-lg transition-colors border border-slate-100 dark:border-slate-700"
            >
              <Eye size={18} />
            </button>
          </div>

          {imageUrl ? (
            <img src={imageUrl} alt={item.titleSnapshot} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" />
          ) : (
            <Package size={48} className="text-slate-300 dark:text-slate-700" />
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">{item.condition}</div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight mb-3 sm:mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.titleSnapshot}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
            </span>
          </div>
        </div>
      </div>

      <ProductModal item={item} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}