import Image from 'next/image';
import { publicApi } from '@/lib/public-api';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { AvailabilityBadge } from '@/components/store/availability-badge';
import { ShieldCheck, Box, Tag } from 'lucide-react';

export default async function StoreCatalogItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await publicApi.getCatalogItem<any>(slug);
  
  if (!item) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h1 className="text-3xl font-black text-slate-400 tracking-tight">Екземпляр не знайдено</h1>
      </div>
    );
  }

  const primaryImage = item.images?.find((x: any) => x.isPrimary)?.imageUrl ?? item.images?.[0]?.imageUrl;
  const price = item.expectedSalePriceManual ?? item.totalCost;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        
        {/* Ліва частина: Липка (Sticky) галерея */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-[3rem] border border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 p-4">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white">
              {primaryImage ? (
                <Image 
                  src={primaryImage} 
                  alt={item.titleSnapshot} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700 cursor-crosshair" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300 font-black text-2xl tracking-widest">
                  NO MEDIA
                </div>
              )}
            </div>
          </div>
          
          {/* Міні-галерея якщо є інші фото */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {item.images.map((img: any) => (
                <div key={img.id} className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer bg-white shadow-sm">
                  <Image src={img.imageUrl} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Права частина: Деталі та Форма (Scrollable) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center min-h-[80vh] pb-20">
          <div className="animate-fade-in-up">
            <AvailabilityBadge quantity={item.quantity} />
            <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tighter leading-[1.1] text-slate-900">
              {item.titleSnapshot}
            </h1>
            
            <div className="mt-8 flex items-baseline gap-4">
              <div className="text-6xl font-black tracking-tighter text-blue-600">{price} ₴</div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Tag size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Стан</div>
                  <div className="text-lg font-black text-slate-900">{item.condition ?? 'Вживаний'}</div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Box size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Комплектація</div>
                  <div className="text-lg font-black text-slate-900">{item.sealed ? 'Запаковано' : 'Відкрито'}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-md p-6 flex gap-4">
              <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-black text-slate-900 text-lg">Гарантія Arcturus</h4>
                <p className="text-slate-600 font-medium mt-1 leading-relaxed text-sm">
                  Цей екземпляр пройшов повну фізичну перевірку. Ми гарантуємо 100% оригінальність та відповідність заявленому стану.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 rounded-[2.5rem] border border-white/80 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden animate-fade-in-up delay-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <h3 className="mb-8 text-3xl font-black tracking-tight text-slate-900">Оформити резерв</h3>
            <OrderContactForm inventoryItemId={item.id} productTitle={item.titleSnapshot} />
          </div>
        </div>

      </div>
    </div>
  );
}