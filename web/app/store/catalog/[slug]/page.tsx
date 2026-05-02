import Image from 'next/image';
import { AvailabilityBadge } from '@/components/store/availability-badge';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { RelatedProducts } from '@/components/store/related-products';
import { publicApi } from '@/lib/public-api';
import { formatMoney } from '@/lib/format';
type Props = {
 params: Promise<{
  slug: string;
 }>;
};
export default async function StoreCatalogItemPage({ params }: Props) {
 const { slug } = await params;
 const item = await publicApi.getCatalogItem<any | null>(slug);
 const related = await publicApi.getCatalog<any[]>({ availableOnly: true });
 if (!item) {
  return (
   <div className="rounded-3xl border border-border bg-white p-10 shadow-sm">
    <div className="text-3xl font-black">Not found</div>
    <div className="mt-3 text-slate-600">This product is not available.</div>
   </div>
  );
 }
 const title = item.titleSnapshot || item.item?.title || slug;
 const images = Array.isArray(item.images) ? item.images : [];
 const primaryImage = images[0]?.imageUrl ?? item.imageUrl ?? null;
 const relatedItems = Array.isArray(related)
  ? related.filter((x) => x.id !== item.id).slice(0, 4)
  : [];
 return (
  <div className="space-y-10">
   <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="space-y-4">
     <div className="overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm">
      {primaryImage ? (
       <Image
        src={primaryImage}
        alt={title}
        width={1200}
        height={900}
        className="h-auto w-full rounded-2xl object-cover"
       />
      ) : (
       <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
      )}
     </div>
     {images.length > 1 ? (
      <div className="grid gap-3 sm:grid-cols-3">
       {images.slice(1).map((image: any) => (
        <div
         key={image.id}
         className="overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-sm"
        >
         <Image
          src={image.imageUrl}
          alt={title}
          width={600}
          height={450}
          className="h-auto w-full rounded-xl object-cover"
         />
        </div>
       ))}
      </div>
     ) : null}
    </div>
    <div className="space-y-6">
     <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
       Product
      </div>
      <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
      <div className="mt-4">
       <AvailabilityBadge quantity={item.quantity} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
       <div>Condition: {item.condition ?? '—'}</div>
       <div>Completeness: {item.completenessPercent ?? '—'}%</div>
       <div>Theme: {item.item?.theme ?? '—'}</div>
       <div>Set Number: {item.item?.setNumber ?? '—'}</div>
       <div>Sealed: {String(item.sealed ?? false)}</div>
      </div>
      <div className="mt-6 text-3xl font-black">
       {formatMoney(item.expectedSalePriceManual ?? item.totalCost ?? item.purchasePrice)}
      </div>
     </div>
     <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="text-lg font-black">Contact / Reserve</div>
      <div className="mt-2 text-sm text-slate-500">
       Send a request for this product.
      </div>
      <div className="mt-4">
       <OrderContactForm
        inventoryItemId={item.id}
        productTitle={title}
       />
      </div>
     </div>
    </div>
   </div>
   <RelatedProducts items={relatedItems} />
  </div>
 );
}