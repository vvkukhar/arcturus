'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' }); // Force revalidate session
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="relative z-10 max-w-lg w-full">
        <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--card)] p-10 sm:p-12 text-center shadow-2xl animate-fade-in-up">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white">
            <CheckCircle className="h-12 w-12" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] mb-4">Вітаємо у клубі!</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Оплату успішно підтверджено. Ваша PRO підписка активована і діє наступні 30 днів. 
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={() => router.push('/deals')} size="lg" className="w-full h-16 rounded-[2rem] text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              Перейти до Угод
            </Button>
            <Button onClick={() => router.push('/screener')} variant="outline" size="lg" className="w-full h-16 rounded-[2rem] text-lg">
              Відкрити Скрінер
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}