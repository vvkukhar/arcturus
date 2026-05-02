import { InventoryBulkTable } from '@/components/admin/inventory-bulk-table';
import { ExportCsvButton } from '@/components/admin/export-csv-button';
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
      <div className="flex justify-between">
        <div className="text-2xl font-black">Inventory</div>
        <ExportCsvButton
          endpoint="/api/admin/inventory/export"
          filename="inventory.csv"
        />
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="No inventory"
          description="Start by adding items"
        />
      ) : (
        <InventoryBulkTable rows={rows} />
      )}
    </div>
  );
}