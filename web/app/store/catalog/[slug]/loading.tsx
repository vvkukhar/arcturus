// call:function_2{"queries":["web/app/store/catalog/[slug]/loading.tsx"]}
import { ArrowLeft } from 'lucide-react';

export default function LoadingProductPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 relative overflow-hidden">
      {/* Скелетон фону */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-slate-200/50 dark:bg-slate-800/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/3 animate-pulse" />

      {/* Кнопка "Назад" */}
      <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-10 w-48 h-10 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        {/* Скелетон Фото */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full rounded-[3rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-xl animate-pulse flex items-center justify-center">
             <div className="w-1/2 h-1/2 bg-slate-200 dark:bg-slate-800 rounded-full blur-3xl opacity-50" />
          </div>
        </div>

        {/* Скелетон Інфо */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-6 space-y-4">
            <div className="h-6 w-32 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse mb-4" />
            <div className="h-12 w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-12 w-2/3 rounded-2xl bg-[var(--card)] border border-[var(--border)] animate-pulse" />
          </div>

          {/* Скелетон Ціни */}
          <div className="mb-8 p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-md h-40 animate-pulse" />

          {/* Скелетон Характеристик */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[var(--card)] border border-[var(--border)] h-20 rounded-2xl animate-pulse" />
            <div className="bg-[var(--card)] border border-[var(--border)] h-20 rounded-2xl animate-pulse" />
          </div>

          {/* Скелетон Кнопок */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
            <div className="h-16 flex-1 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-16 flex-1 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
          </div>

          {/* Скелетон Гарантій */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-24 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
            <div className="h-24 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}