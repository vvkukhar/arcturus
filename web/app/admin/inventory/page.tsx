import { CreateInventoryDialog } from '@/components/admin/create-inventory-dialog';
import { ExportCsvButton } from '@/components/admin/export-csv-button';
import { InventoryBulkTable } from '@/components/admin/inventory-bulk-table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import type { InventoryItem } from '@/lib/types';

// Server Component: Отримуємо дані напряму на сервері, без зайвих useEffect
async function getInventory(): Promise<InventoryItem[]> {
  try {
    return await api.get<InventoryItem[]>('/inventory');
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return [];
  }
}

export default async function InventoryPage() {
  const rows = await getInventory();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Stock, cost basis, media, sale price, and reprice flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExportCsvButton
            endpoint="/api/admin/inventory/export"
            filename={`arcturus_inventory_${new Date().toISOString().split('T')[0]}.csv`}
          />
          <CreateInventoryDialog />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState 
          title="No inventory found" 
          description="Start by adding your first LEGO set or minifigure." 
        />
      ) : (
        <InventoryBulkTable rows={rows} />
      )}
    </div>
  );
}