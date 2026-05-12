'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/format';
import { swrFetcher } from '@/lib/swr-fetcher';

interface OrderSuccessData {
  id: string;
  status: string;
  buyerName: string;
  productTitle: string;
  sellPrice: number;
  inventoryItem?: {
    images?: { imageUrl: string; isPrimary: boolean }[];
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || searchParams.get('reference');

  const { data: order, isLoading, error } = useSWR<OrderSuccessData>(
    orderId ? `/api/admin/orders/${orderId}` : null,
    swrFetcher,
    { refreshInterval: (data) => (data?.status === 'paid' ? 0 : 2000) }
  );

  useEffect(() => {
    if (!orderId) {
      router.replace('/store/catalog');
    }
  }, [orderId, router]);

  if (isLoading || (order && order.status !== 'paid' && !error)) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Підтвердження транзакції...
          </div>
        </div>
      </main>
    );
  }

  const imageUrl = order?.inventoryItem?.images?.find(img => img.isPrimary)?.imageUrl || order?.inventoryItem?.images?.[0]?.imageUrl;

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="relative z-10 max-w-lg w-full">
        <div className="rounded-[3rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-2xl p-10 sm:p-12 text-center shadow-2xl animate-fade-in-up">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] mb-2">Оплата успішна</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Дякуємо, {order?.buyerName?.split(' ')[0] || 'клієнте'}! Ваше замовлення підтверджено та передано на пакування.
          </p>
          {order && (
            <div className="mb-10 rounded-3xl bg-[var(--background)] p-4 shadow-sm border border-[var(--border)] flex items-center gap-4 text-left">
              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-[var(--border)]">
                {imageUrl ? (
                  <Image src={imageUrl} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Замовлення #{order.id.slice(-6)}</div>
                <div className="font-black text-[var(--foreground)] truncate">{order.productTitle}</div>
                <div className="text-blue-600 font-black mt-1">{formatMoney(order.sellPrice)}</div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <Button href="/store/catalog" size="lg" className="w-full h-16 rounded-[2rem] text-lg">
              Повернутись до каталогу
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 animate-fade-in-up delay-200">
          <Package className="h-4 w-4" />
          Arcturus Secure Checkout
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Завантаження...</div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}