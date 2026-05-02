import { CatalogService } from '../catalog/catalog.service';
import { SalesService } from '../sales/sales.service';

export class DashboardService {
  constructor(
    private catalogService = new CatalogService(),
    private salesService = new SalesService()
  ) {}

  async getExecutionSummary() {
    const catalogItems = await this.catalogService.list();
    const sales = await this.salesService.listSales();

    return {
      purchasePending: catalogItems.filter((i) => i.status === 'pending').length,
      purchaseBought: catalogItems.filter((i) => i.status === 'bought').length,
      repricePending: catalogItems.filter((i) => i.status === 'reprice_pending').length,
      repriceListed: catalogItems.filter((i) => i.status === 'listed').length,
      reviewPending: catalogItems.filter((i) => i.status === 'review_pending').length,
      reviewDone: catalogItems.filter((i) => i.status === 'review_done').length,
      headline: 'Dashboard Summary',
    };
  }
}