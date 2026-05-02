export type SaleRecord = {
  id: string;
  itemSlug: string;
  quantity: number;
  price: number;
  date: Date;
};

export class SalesService {
  private sales: SaleRecord[] = [];

  async listSales(): Promise<SaleRecord[]> {
    return this.sales;
  }

  async recordSale(record: Omit<SaleRecord, 'id'>): Promise<SaleRecord> {
    const newRecord: SaleRecord = { ...record, id: Math.random().toString(36) };
    this.sales.push(newRecord);
    return newRecord;
  }
}