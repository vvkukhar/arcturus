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
        className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <div className="aspect-square bg-slate-50 relative p-6 flex items-center justify-center">
          {item.sealed && (
            <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-black tracking-wider uppercase rounded-md">
              Sealed
            </span>
          )}
          
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <button 
              onClick={handleAddToCart}
              className="p-2.5 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-full shadow-lg transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
            <button 
              className="p-2.5 bg-white text-slate-900 hover:bg-slate-900 hover:text-white rounded-full shadow-lg transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>

          {imageUrl ? (
            <img src={imageUrl} alt={item.titleSnapshot} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <Package size={48} className="text-slate-300" />
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{item.condition}</div>
          <h3 className="font-bold text-slate-900 text-base leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.titleSnapshot}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-black text-slate-900">
              {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
            </span>
          </div>
        </div>
      </div>

      <ProductModal item={item} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}