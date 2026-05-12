'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CheckCircle2, XCircle, PackageSearch, Zap } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';
import { formatMoney } from '@/lib/format';

interface UnresolvedRow {
  id: string;
  sourceCode: string;
  titleRaw: string;
  extractedSetNo?: string | null;
  status: string;
  listing?: {
    price: number;
    url: string;
    imageUrl?: string;
  };
}

export function OperatorSpeedDesk({ 
  items, 
  onResolveAction, 
  onDismissAction 
}: { 
  items: UnresolvedRow[]; 
  onResolveAction: (id: string, itemId: string) => Promise<void>;
  onDismissAction: (id: string) => Promise<void>;
}) {
  const { t } = useI18n();
  const [optimisticItems, setOptimisticItems] = useState<UnresolvedRow[]>([]);
  const [streak, setStreak] = useState(0);
  const lastActionTimeRef = useRef(Date.now());
  const isProcessingRef = useRef(false);

  useEffect(() => {
    setOptimisticItems(items.filter(i => i.status === 'pending'));
  }, [items]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActionTimeRef.current > 10000 && streak > 0) {
        setStreak(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [streak]);

  const currentItem = optimisticItems[0];

  const preloadedImages = useMemo(() => {
    return optimisticItems.slice(1, 4).map(item => item.listing?.imageUrl).filter(Boolean) as string[];
  }, [optimisticItems]);

  const executeAction = useCallback(async (type: 'resolve' | 'dismiss', id: string, extraData?: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    setOptimisticItems(prev => prev.filter(i => i.id !== id));
    setStreak(s => s + 1);
    lastActionTimeRef.current = Date.now();

    try {
      if (type === 'resolve' && extraData) {
        await onResolveAction(id, extraData);
      } else {
        await onDismissAction(id);
      }
    } catch {
      setStreak(0);
    } finally {
      isProcessingRef.current = false;
    }
  }, [onResolveAction, onDismissAction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentItem || isProcessingRef.current) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      
      switch(e.key) {
        case 'Enter':
          e.preventDefault();
          if (currentItem.extractedSetNo) {
            executeAction('resolve', currentItem.id, currentItem.extractedSetNo);
          }
          break;
        case ' ':
        case 'Backspace':
          e.preventDefault();
          executeAction('dismiss', currentItem.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentItem, executeAction]);

  if (optimisticItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-[2.5rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50 hardware-accelerated animate-in zoom-in-95 duration-300">
        <PackageSearch size={48} className="text-emerald-500 mb-6" />
        <h3 className="text-2xl font-black text-[var(--foreground)]">{t('operator.noMatches' as any)}</h3>
        {streak > 10 && (
          <div className="mt-4 flex items-center gap-2 text-orange-500 font-black animate-bounce">
            <Zap size={20} /> MAX STREAK: {streak}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 md:p-12 shadow-xl overflow-hidden hardware-accelerated">
      <div className="hidden">
        {preloadedImages.map((src, idx) => (
          <img key={idx} src={src} alt="preload" />
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800">
        <div 
          className="h-full bg-blue-600 transition-all duration-200 ease-out" 
          style={{ width: `${(1 - (optimisticItems.length / Math.max(items.length, 1))) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-4">
          <span>{t('operator.speedDesk' as any)} • {optimisticItems.length} left</span>
          {streak > 2 && (
            <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md animate-in fade-in zoom-in">
              <Zap size={14} className="fill-current" /> {streak} Combo
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <kbd className="px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-black shadow-sm">SPACE / BKSP to Reject</kbd>
          <kbd className="px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[10px] font-black shadow-sm text-emerald-600">ENTER to Accept</kbd>
        </div>
      </div>

      <div key={currentItem.id} className="grid md:grid-cols-2 gap-8 items-center min-h-[300px] animate-in slide-in-from-right-8 fade-in duration-200">
        <div className="bg-[var(--background)] rounded-[2rem] p-6 border border-[var(--border)] flex items-center justify-center h-full">
          {currentItem.listing?.imageUrl ? (
            <img src={currentItem.listing.imageUrl} alt="Listing" className="max-h-[250px] object-contain mix-blend-multiply dark:mix-blend-normal rounded-xl" />
          ) : (
            <PackageSearch size={64} className="text-slate-300 dark:text-slate-700" />
          )}
        </div>

        <div className="flex flex-col h-full justify-center">
          <div className="inline-flex px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 mb-4 w-fit border border-[var(--border)]">
            {currentItem.sourceCode}
          </div>
          
          <h2 className="text-3xl font-black text-[var(--foreground)] leading-tight mb-4 line-clamp-3">
            {currentItem.titleRaw}
          </h2>

          <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-8">
            {formatMoney(currentItem.listing?.price)}
          </div>

          <div className="flex gap-4 mt-auto">
            <button 
              onClick={() => executeAction('dismiss', currentItem.id)}
              className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <XCircle size={28} className="group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-xs">Dismiss</span>
              </div>
            </button>

            <button 
              disabled={!currentItem.extractedSetNo}
              onClick={() => currentItem.extractedSetNo && executeAction('resolve', currentItem.id, currentItem.extractedSetNo)}
              className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 group"
            >
              <CheckCircle2 size={28} className="group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-xs">Map to #{currentItem.extractedSetNo || '???'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}