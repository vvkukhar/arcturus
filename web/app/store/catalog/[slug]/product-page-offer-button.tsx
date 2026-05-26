// call:function_2{"queries":["web/app/store/catalog/[slug]/product-page-offer-button.tsx"]}
'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { MakeOfferModal } from '@/components/store/make-offer-modal';

interface ProductPageOfferButtonProps {
  inventoryItemId: string;
  productTitle: string;
  currentPrice: number;
}

export function ProductPageOfferButton({ inventoryItemId, productTitle, currentPrice }: ProductPageOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex h-16 items-center justify-center gap-2.5 rounded-[2rem] text-sm sm:text-base font-black transition-all bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-purple-500/25 active:scale-95 outline-none"
      >
        <Award className="h-5 w-5 shrink-0" />
        <span className="truncate">Запропонувати ціну</span>
      </button>

      <MakeOfferModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inventoryItemId={inventoryItemId}
        productTitle={productTitle}
        currentPrice={currentPrice}
      />
    </>
  );
}