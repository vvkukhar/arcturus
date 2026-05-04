'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { formatMoney } from '@/lib/format';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('reference');
    
    if (!orderId) {
      router.push('/store/catalog');
      return;
    }

    let attempts = 0;

    const checkOrderStatus = async () => {
      try {
        const data = await apiFetch<any>(`/api/admin/orders/${orderId}`);
        if (data && data.status === 'paid') {
          setOrder(data);
          setLoading(false);
        } else if (attempts < 5) {
          attempts++;
          setTimeout(checkOrderStatus, 2000);
        } else {
          setOrder(data);
          setLoading(false);
        }
      } catch (error) {
        if (attempts < 5) {
          attempts++;
          setTimeout(checkOrderStatus, 2000);
        } else {
          setLoading(false);
        }
      }
    };

    checkOrderStatus();
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Підтвердження транзакції...
          </div>
        </div>
      </main>
    );
  }

  const imageUrl = order?.inventoryItem?.images?.find((img: any) => img.isPrimary)?.imageUrl 
    || order?.inventoryItem?.images?.[0]?.imageUrl;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      
      <div className="relative z-10 max-w-lg w-full">
        <div className="rounded-[3rem] border border-white/60 bg-white/70 backdrop-blur-2xl p-10 sm:p-12 text-center shadow-2xl shadow-emerald-900/5 animate-fade-in-up">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Оплата успішна
          </h1>
          
          <p className="text-slate-600 font-medium leading-relaxed mb-8">
            Дякуємо, {order?.buyerName?.split(' ')[0] || 'клієнте'}! Ваше замовлення підтверджено та передано на пакування.
          </p>

          {order && (
            <div className="mb-10 rounded-3xl bg-white p-4 shadow-sm border border-slate-100 flex items-center gap-4 text-left">
              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
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
                <div className="font-black text-slate-900 truncate">{order.productTitle}</div>
                <div className="text-blue-600 font-black mt-1">{formatMoney(order.sellPrice)}</div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <Button href="/store/catalog" size="lg" className="w-full h-16 rounded-[2rem] text-lg bg-slate-900 hover:bg-black">
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