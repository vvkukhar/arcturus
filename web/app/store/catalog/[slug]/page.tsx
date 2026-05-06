import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/public-api';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { RelatedProducts } from '@/components/store/related-products';
import { AvailabilityBadge } from '@/components/store/availability-badge';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: any;

  try {
    product = await publicApi.getCatalogItem(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const images = product.images || [];
  const primaryImage = images.find((img: any) => img.isPrimary)?.imageUrl || images[0]?.imageUrl;
  const price = product.expectedSalePriceManual ?? product.totalCost;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-100">
            {primaryImage ? (
              <img src={primaryImage} alt={product.titleSnapshot} className="h-full w-full object-contain mix-blend-multiply" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300 font-bold uppercase">No Image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img: any) => (
                <div key={img.id} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={img.imageUrl} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <AvailabilityBadge quantity={product.quantity} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              {product.condition}
            </span>
            {product.sealed && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                Sealed
              </span>
            )}
          </div>

          <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {product.titleSnapshot}
          </h1>
          
          <div className="mb-8 flex items-center gap-4 text-sm font-semibold text-slate-500">
            <span>ID: {product.item?.setNumber || product.itemId.slice(0, 8)}</span>
            <span>&bull;</span>
            <span>{product.item?.theme || 'Unknown Theme'}</span>
          </div>

          <div className="mb-10 text-4xl font-black text-slate-900">
            {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-6 text-lg font-black text-slate-900">Fast Checkout / Reserve</h3>
            <OrderContactForm inventoryItemId={product.id} productTitle={product.titleSnapshot} />
          </div>
        </div>
      </div>

      <RelatedProducts items={product.related || []} />
    </div>
  );
}