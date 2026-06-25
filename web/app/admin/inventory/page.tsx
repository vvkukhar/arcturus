import { CreateInventoryDialog } from '@/components/admin/create-inventory-dialog';
import { ExportCsvButton } from '@/components/admin/export-csv-button';
import { InventoryBulkTable } from '@/components/admin/inventory-bulk-table';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import type { InventoryItem } from '@/lib/types';
import { TableSearchForm } from '@/components/admin/table-search-form';
import { dict } from '@/lib/i18n';

export const revalidate = 0;

async function getInventory(): Promise<InventoryItem[]> {
  try {
    return await api.get<InventoryItem[]>('/inventory');
  } catch {
    return [];
  }
}

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function InventoryPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const rows = await getInventory();
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  const filtered = q
    ? rows.filter((row) =>
        `${row.titleSnapshot} ${row.itemId}`.toLowerCase().includes(q.toLowerCase()),
      )
    : rows;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.inventory.title' as any)}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t('admin.inventory.subtitle' as any)}
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

      <div className="mb-4">
        <TableSearchForm placeholder="Search inventory by title or item ID" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          title={t('admin.inventory.emptyTitle' as any)} 
          description={q ? "No items match your search criteria." : t('admin.inventory.emptyDesc' as any)} 
        />
      ) : (
        <InventoryBulkTable rows={filtered} />
      )}
    </div>
  );
}