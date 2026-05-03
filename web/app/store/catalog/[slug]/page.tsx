import Link from 'next/link';
import { publicApi } from '@/lib/public-api';
import { formatMoney } from '@/lib/format';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { AvailabilityBadge } from '@/components/store/availability-badge';
import { RelatedProducts } from '@/components/store/related-products';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StoreCatalogItemPage({ params }: Props) {
  const { slug } = await params;

  let item: any = null;

  try {
    item = await publicApi.getCatalogItem<any>(slug);
  } catch {
    item = null;
  }

  if (!item) {
    return (
      <div className="rounded-3xl border border-border bg-white p-10">
        <div className="text-2xl font-black">Product not found</div>
        <Link
          href="/store/catalog"
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  const title = item.titleSnapshot || item.item?.title || 'Product';
  const price = item.expectedSalePriceManual ?? item.totalCost;
  const images = Array.isArray(item.images) ? item.images : [];
  const primaryImage =
    images.find((image: any) => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;

  return (
    <div className="space-y-8">
      <Link href="/store/catalog" className="text-sm font-semibold text-slate-500 hover:underline">
        ← Back to catalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-5">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImage} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No image
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.slice(0, 8).map((image: any) => (
                <div
                  key={image.id ?? image.imageUrl}
                  className="aspect-square overflow-hidden rounded-xl border border-border bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5 rounded-3xl border border-border bg-white p-8">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Arcturus Store
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight">{title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <AvailabilityBadge quantity={item.quantity} />
            {item.condition ? (
              <span className="inline-flex rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {item.condition}
              </span>
            ) : null}
            {item.sealed ? (
              <span className="inline-flex rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                Sealed
              </span>
            ) : null}
          </div>

          <div className="text-3xl font-black">{formatMoney(price)}</div>

          <div className="grid gap-3 rounded-2xl border border-border bg-slate-50 p-4 text-sm">
            <div>Quantity: {item.quantity ?? 0}</div>
            <div>Theme: {item.item?.theme ?? '—'}</div>
            <div>Set Number: {item.item?.setNumber ?? '—'}</div>
            <div>Item ID: {item.itemId ?? item.id}</div>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="mb-3 text-lg font-black">Reserve this item</div>
            <OrderContactForm inventoryItemId={item.id} productTitle={title} />
          </div>
        </div>
      </div>

      <RelatedProducts items={Array.isArray(item.related) ? item.related : []} />
    </div>
  );
}