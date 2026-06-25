'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle size={40} strokeWidth={2.5} />
      </div>
      <h2 className="mb-2 text-2xl font-black text-[var(--foreground)] tracking-tight">{t('admin.error.title' as any)}</h2>
      <p className="mb-6 max-w-lg text-sm font-medium text-slate-500 bg-[var(--card)] border border-[var(--border)] p-4 rounded-xl shadow-sm">
        {error.message || 'An unknown error occurred while rendering the dashboard.'}
      </p>
      <Button onClick={() => reset()} className="gap-2 rounded-xl">
        <RotateCcw size={16} />
        {t('admin.error.retry' as any)}
      </Button>
    </div>
  );
}