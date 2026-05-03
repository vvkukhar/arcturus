import Image from 'next/image';
import { publicApi } from '@/lib/public-api';
import { OrderContactForm } from '@/components/store/order-contact-form';
import { AvailabilityBadge } from '@/components/store/availability-badge';

export default async function StoreCatalogItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await publicApi.getCatalogItem<any>(slug);
  
  if (!item) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-black text-slate-400">Product Not Found</h1>
      </div>
    );
  }

  const primaryImage = item.images?.find((x: any) => x.isPrimary)?.imageUrl ?? item.images?.[0]?.imageUrl;
  const price = item.expectedSalePriceManual ?? item.totalCost;

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-[3rem] border border-slate-200 bg-white p-6 shadow-sm">
          {primaryImage ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem]">
              <Image src={primaryImage} alt={item.titleSnapshot} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-[2rem] bg-slate-50 text-slate-400 font-semibold">
              No Image Available
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <AvailabilityBadge quantity={item.quantity} />
            <h1 className="mt-4 text-4xl sm:text-5xl font-black leading-tight text-slate-900">
              {item.titleSnapshot}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-4xl font-black text-blue-600">{price} UAH</div>
              {item.condition && (
                <div className="rounded-xl bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                  {item.condition}
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">Reserve This Item</h3>
            <OrderContactForm inventoryItemId={item.id} productTitle={item.titleSnapshot} />
          </div>
        </div>
      </div>
    </div>
  );
}