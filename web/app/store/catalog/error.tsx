'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Каталог тимчасово недоступний</h2>
      <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
        Сталася помилка при завантаженні товарів. Будь ласка, спробуйте оновити сторінку.
      </p>
      <Button onClick={() => reset()} size="lg" className="rounded-full">
        Спробувати знову
      </Button>
    </div>
  );
}