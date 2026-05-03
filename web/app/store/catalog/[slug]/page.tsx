import Image from 'next/image';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/public-api';
import { formatMoney } from '@/lib/format';
import { AvailabilityBadge } from '@/components/store/availability-badge';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { RelatedProducts } from '@/components/store/related-products';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CatalogItemPage({ params }: Props) {
  const { slug } = await params;

  let product: any;
  try {
    product = await publicApi.getCatalogItem(slug);
  } catch {
    notFound();
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images.find((x: any) => x.isPrimary) ?? images[0];
  const price = product.expectedSalePriceManual ?? product.totalCost;
  const title = product.titleSnapshot || product.item?.title || 'Unknown Product';

  return (
    <div className="space-y-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            {primaryImage ? (
              <Image src={primaryImage.imageUrl} alt={title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                No Image
              </div>
            )}
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: any) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white cursor-pointer hover:border-slate-400">
                  <Image src={img.imageUrl} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <AvailabilityBadge quantity={product.quantity} />
              {product.condition ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                  {product.condition}
                </span>
              ) : null}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950">
              {title}
            </h1>
            <div className="mt-2 text-sm font-semibold text-slate-500">
              {product.item?.setNumber ? `Set #${product.item.setNumber} • ` : ''}
              {product.item?.theme ?? 'Custom Build'}
            </div>
          </div>

          <div className="text-5xl font-black text-slate-900">
            {formatMoney(price)}
          </div>

          {product.quantity > 0 ? (
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 text-lg font-bold">Reserve this item</div>
              <OrderContactForm inventoryItemId={product.id} productTitle={title} />
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-600">
              This item is currently out of stock. Check back later or view related items below.
            </div>
          )}
        </div>
      </div>

      <RelatedProducts items={product.related || []} />
    </div>
  );
}