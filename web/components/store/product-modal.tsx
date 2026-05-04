'use client';

import { InventoryItem } from '@/lib/types';
import { useCart } from '../providers/cart-provider';
import { X, ShoppingCart, CheckCircle2, ShieldCheck, Package } from 'lucide-react';
import { useEffect } from 'react';

export function ProductModal({ item, isOpen, onClose }: { item: InventoryItem; isOpen: boolean; onClose: () => void }) {
  const { addItem } = useCart();
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const price = item.expectedSalePriceManual ?? item.totalCost;
  const imageUrl = item.images?.[0]?.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur text-slate-500 hover:text-slate-900 rounded-full">
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center min-h-[300px]">
          {imageUrl ? (
            <img src={imageUrl} alt={item.titleSnapshot} className="w-full h-full object-contain mix-blend-multiply" />
          ) : (
            <Package size={64} className="text-slate-300" />
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="flex gap-2 mb-4">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded">
              {item.condition}
            </span>
            {item.sealed && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded">
                Sealed
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
            {item.titleSnapshot}
          </h2>
          
          {item.itemId && <p className="text-sm text-slate-500 font-medium mb-6">ID: {item.itemId}</p>}

          <div className="text-4xl font-black text-slate-900 mb-8">
            {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <CheckCircle2 size={18} className="text-green-500" />
              In stock, ready to ship
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <ShieldCheck size={18} className="text-blue-500" />
              100% Authentic LEGO Guarantee
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => {
                addItem({ id: item.id, title: item.titleSnapshot, price, imageUrl });
                onClose();
              }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/30"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}