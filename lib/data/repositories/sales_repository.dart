// lib/data/repositories/sales_repository.dart

import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/data/store/sales_memory_store.dart';

class SalesRepository {
  List<SaleModel> getAllSales() {
    return SalesMemoryStore.sales;
  }

  SaleModel? getByItemId(String itemId) {
    return SalesMemoryStore.getByItemId(itemId);
  }

  void addSale(SaleModel sale) {
    SalesMemoryStore.addSale(sale);
  }

  void updateSale(SaleModel sale) {
    SalesMemoryStore.updateSale(sale);
  }

  void deleteSale(String id) {
    SalesMemoryStore.deleteSale(id);
  }
}
