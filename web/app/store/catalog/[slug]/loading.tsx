// call:function_4{"queries":["web/app/store/catalog/[slug]/loading.tsx"]}
import { ArrowLeft } from 'lucide-react';

export default function LoadingProductPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Кнопка "Назад" */}
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold text-slate-400 mb-8 w-40 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Скелетон Фото */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full rounded-[3rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-xl animate-pulse" />
        </div>

        {/* Скелетон Інфо */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-6 space-y-4">
            <div className="h-12 w-3/4 rounded-2xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-12 w-1/2 rounded-2xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            
            <div className="flex gap-3 mt-4">
              <div className="h-8 w-24 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse" />
              <div className="h-8 w-32 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            </div>
          </div>

          {/* Скелетон Ціни */}
          <div className="mb-8 p-6 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] shadow-md h-32 animate-pulse" />

          {/* Скелетон Опису */}
          <div className="mb-10 space-y-3 bg-[var(--background)] p-6 rounded-[1.5rem] border border-[var(--border)] h-32 animate-pulse" />

          {/* Скелетон Кнопок */}
          <div className="flex flex-col gap-4 mb-8 w-full">
            <div className="h-16 w-full rounded-[2rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-16 w-full rounded-[2rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-20 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-20 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}