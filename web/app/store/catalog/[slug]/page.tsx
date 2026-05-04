import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/public-api';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { AvailabilityBadge } from '@/components/store/availability-badge';
import { formatMoney } from '@/lib/format';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface CatalogItemDetail {
  id: string;
  titleSnapshot?: string;
  item?: { title?: string; setNumber?: string; theme?: string };
  expectedSalePriceManual?: number;
  totalCost?: number;
  condition?: string;
  sealed?: boolean;
  quantity: number;
  images?: { isPrimary?: boolean; imageUrl: string }[];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await publicApi.getCatalogItem<CatalogItemDetail>(slug);
    const title = data.titleSnapshot || data.item?.title || 'LEGO Set';
    return {
      title: `${title} | Arcturus Store`,
      description: `Придбати ${title}. Стан: ${data.condition}. Оригінальне LEGO.`,
    };
  } catch {
    return { title: 'Not Found | Arcturus Store' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: CatalogItemDetail;

  try {
    product = await publicApi.getCatalogItem<CatalogItemDetail>(slug);
  } catch {
    notFound();
  }

  const title = product.titleSnapshot || product.item?.title || 'Unknown Product';
  const price = product.expectedSalePriceManual ?? product.totalCost ?? 0;
  const isAvailable = product.quantity > 0;
  
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? [...product.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    : [];

  return (
    <div className="mx-auto max-w-7xl animate-fade-in-up">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            {images.length > 0 ? (
              <Image
                src={images[0].imageUrl}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 font-medium">
                Немає фото
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Image src={img.imageUrl} alt="" fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col pt-4 lg:pt-8">
          <div className="mb-4 flex items-center gap-3">
            <AvailabilityBadge quantity={product.quantity} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              {product.condition} {product.sealed && '(Sealed)'}
            </span>
            {product.item?.theme && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                {product.item.theme}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>

          <div className="mt-6 flex items-end gap-4">
            <div className="text-5xl font-black text-blue-600 tracking-tighter">
              {formatMoney(price)}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-200 py-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <div className="text-sm font-semibold text-slate-700">100%<br/>Оригінал</div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="text-sm font-semibold text-slate-700">Надійна<br/>Доставка</div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-indigo-500" />
              <div className="text-sm font-semibold text-slate-700">Огляд при<br/>Отриманні</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-black text-slate-900">Оформлення замовлення</h3>
            {isAvailable ? (
              <OrderContactForm inventoryItemId={product.id} productTitle={title} />
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800 font-semibold">
                На жаль, цей товар вже продано або зарезервовано іншим клієнтом.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}