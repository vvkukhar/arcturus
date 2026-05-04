import { ProductCard } from '@/components/store/product-card';
import { InventoryItem } from '@/lib/types';
import { PackageSearch } from 'lucide-react';

async function getCatalogItems(): Promise<InventoryItem[]> {
  try {
    const res = await fetch(`${process.env.API_BASE_URL || 'http://localhost:4000/api'}/public/catalog`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CatalogPage() {
  const items = await getCatalogItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Catalog</h1>
          <p className="text-slate-500 mt-2 text-lg">Explore our curated collection of LEGO sets and minifigures.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <PackageSearch size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No items found</h3>
          <p className="text-slate-500 mt-2">Check back later for new arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}