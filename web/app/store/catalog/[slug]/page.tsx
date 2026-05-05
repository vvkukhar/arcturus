import { InventoryItem } from '@/lib/types';
import { Package, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/store/product-card';

async function getItem(id: string): Promise<InventoryItem | null> {
  try {
    const res = await fetch(`${process.env.API_BASE_URL || 'http://localhost:4000/api'}/public/catalog/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const item = await getItem(resolvedParams.slug);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Item not found</h1>
        <Link href="/store/catalog" className="text-blue-600 hover:underline font-bold">Return to Catalog</Link>
      </div>
    );
  }

  const price = item.expectedSalePriceManual ?? item.totalCost;
  const imageUrl = item.images?.[0]?.imageUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/store/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-sm">
        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 p-8 sm:p-12 flex items-center justify-center min-h-[400px]">
          {imageUrl ? (
            <img src={imageUrl} alt={item.titleSnapshot} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
          ) : (
            <Package size={80} className="text-slate-300 dark:text-slate-700" />
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-md">
              {item.condition}
            </span>
            {item.sealed && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 text-xs font-black uppercase tracking-wider rounded-md">
                Sealed
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            {item.titleSnapshot}
          </h1>
          
          <div className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
            {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(price)}
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-base text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
              <CheckCircle2 size={24} className="text-green-500 shrink-0" />
              <span>In stock. Ships securely within 24 hours.</span>
            </div>
            <div className="flex items-center gap-3 text-base text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
              <ShieldCheck size={24} className="text-blue-500 shrink-0" />
              <span>100% Authentic LEGO Guarantee. Checked parts.</span>
            </div>
          </div>

          <ProductCard item={item} />
        </div>
      </div>
    </div>
  );
}