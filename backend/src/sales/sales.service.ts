import { Sale } from './sales.model';
import { generateId } from '../lib/utils';

export class SalesService {
  async recordSale(catalogItemId: string, salePrice: number, profit: number) {
    return Sale.create({ id: generateId(), catalogItemId, salePrice, profit });
  }

  async listSales() {
    return Sale.findAll();
  }

  async totalProfit() {
    const sales = await Sale.findAll();
    return sales.reduce((sum, s) => sum + s.profit, 0);
  }
}