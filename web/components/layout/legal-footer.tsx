'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';

export function LegalFooter() {
  const { t } = useI18n();

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-medium space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-bold uppercase mb-1">{t('legal.ownerInfo' as any)}</p>
          <p>{t('legal.ownerName' as any)}</p>
          <p>{t('legal.ownerId' as any)}</p>
          <p>{t('legal.ownerAddress' as any)}</p>
        </div>
        <div className="md:text-right">
          <p className="font-bold uppercase mb-1">{t('footer.contact' as any)}</p>
          <p>Email: arcturusbuild@gmail.com</p>
          <p>Тел: +380 (93) 118-22-35</p>
        </div>
      </div>
      <div className="text-center mt-6">
        <p>© 2026 Arcturus Terminal. {t('footer.rights' as any)} LEGO {t('legal.trademark' as any)}</p>
        <div className="flex justify-center flex-wrap gap-4 mt-2">
          <Link href="/terms" className="hover:underline">{t('footer.terms' as any)}</Link>
          <Link href="/privacy" className="hover:underline">{t('footer.privacy' as any)}</Link>
          <Link href="/delivery" className="hover:underline">{t('nav.delivery' as any)}</Link>
          <Link href="/returns" className="hover:underline">{t('legal.returns' as any)}</Link>
        </div>
      </div>
    </div>
  );
}