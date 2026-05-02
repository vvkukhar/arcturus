import { Sale } from '../sales/sales.model';
import { CatalogItem } from '../catalog/catalog.model';

export class AnalyticsService {
  async totalProfit() {
    const sales = await Sale.findAll();
    return sales.reduce((sum, s) => sum + s.totalPrice, 0);
  }

  async salesCount() {
    return Sale.count();
  }

  async topItems(limit = 5) {
    return CatalogItem.findAll({
      include: [Sale],
      order: [[Sale, 'totalPrice', 'DESC']],
      limit,
    });
  }
}