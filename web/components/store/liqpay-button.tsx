'use client';

import React from 'react';

interface LiqPayButtonProps {
  data: string;
  signature: string;
}

export function LiqPayButton({ data, signature }: LiqPayButtonProps) {
  return (
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" acceptCharset="utf-8">
      <input type="hidden" name="data" value={data} />
      <input type="hidden" name="signature" value={signature} />
      <button 
        type="submit"
        className="w-full flex h-16 items-center justify-center gap-3 rounded-[2rem] bg-[#77bb44] text-white text-lg font-black transition-all hover:bg-[#66aa33] shadow-xl"
      >
        <img src="https://static.liqpay.ua/buttons/logo-small.png" alt="LiqPay" className="h-6" />
        Оплатити карткою
      </button>
    </form>
  );
}