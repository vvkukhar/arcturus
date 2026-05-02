// lib/data/store/sales_memory_store.dart

import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesMemoryStore {
  SalesMemoryStore._();

  static final List<SaleModel> _sales = [];

  static List<SaleModel> get sales => List.from(_sales);

  static void replaceAll(List<SaleModel> items) {
    _sales
      ..clear()
      ..addAll(items);
  }

  static void hydrate(List<SaleModel> items) {
    replaceAll(items);
  }

  static void addSale(SaleModel sale) {
    _sales.insert(0, sale);
  }

  static void updateSale(SaleModel updatedSale) {
    final index = _sales.indexWhere((sale) => sale.id == updatedSale.id);
    if (index == -1) return;
    _sales[index] = updatedSale;
  }

  static void deleteSale(String id) {
    _sales.removeWhere((sale) => sale.id == id);
  }

  static SaleModel? getByItemId(String itemId) {
    try {
      return sales.firstWhere((sale) => sale.itemId == itemId);
    } catch (_) {
      return null;
    }
  }

  static void clear() {
    _sales.clear();
  }
}
