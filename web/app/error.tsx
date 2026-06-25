'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-500/20 text-red-500 border border-red-500/30">
        <AlertCircle size={48} strokeWidth={2.5} />
      </div>
      <h2 className="mb-3 text-3xl font-black tracking-tight">{t('admin.error.title' as any)}</h2>
      <div className="mb-8 max-w-xl text-left bg-black border border-slate-800 p-6 rounded-2xl shadow-2xl overflow-hidden">
        <p className="text-sm font-mono text-red-400 break-words">
          {error.message || 'An unknown layout error occurred.'}
        </p>
      </div>
      <Button onClick={() => window.location.href = '/'} className="gap-2 rounded-xl h-14 px-8 text-lg">
        <RotateCcw size={20} />
        {t('admin.error.retry' as any)}
      </Button>
    </div>
  );
}