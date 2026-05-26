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
        className="w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] text-lg font-black transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/20 active:scale-[0.98] outline-none"
      >
        <Award className="h-6 w-6" />
        Запропонувати ціну
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