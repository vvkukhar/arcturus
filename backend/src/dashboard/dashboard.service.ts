import { SalesService } from '../sales/sales.service';
import { CatalogService } from '../catalog/catalog.service';

export class DashboardService {
  constructor(
    private salesService = new SalesService(),
    private catalogService = new CatalogService()
  ) {}

  async summary() {
    const totalProfit = await this.salesService.totalProfit();
    const items = await this.catalogService.list();

    const purchasePending = items.filter((i) => i.status === 'pending').length;
    const purchaseBought = items.filter((i) => i.status === 'available').length;
    const repricePending = 0; // placeholder
    const repriceListed = 0; // placeholder
    const reviewPending = 0;
    const reviewDone = 0;

    return {
      totalProfit,
      purchasePending,
      purchaseBought,
      repricePending,
      repriceListed,
      reviewPending,
      reviewDone,
      headline: 'Dashboard Overview',
    };
  }
}