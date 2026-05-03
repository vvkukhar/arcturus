import { CreateInventoryDialog } from '@/components/admin/create-inventory-dialog';
import { ExportCsvButton } from '@/components/admin/export-csv-button';
import { InventoryBulkTable } from '@/components/admin/inventory-bulk-table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';

async function getRows(): Promise<any[]> {
  try {
    return await api.get('/inventory');
  } catch {
    return [];
  }
}

export default async function Page() {
  const rows = await getRows();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-black">Inventory</div>
          <div className="mt-1 text-sm text-slate-500">
            Stock, cost basis, media, sale price, and reprice flow.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportCsvButton
            endpoint="/api/admin/inventory/export"
            filename="inventory.csv"
          />
          <CreateInventoryDialog />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No inventory" description="Start by adding items" />
      ) : (
        <InventoryBulkTable rows={rows} />
      )}
    </div>
  );
}