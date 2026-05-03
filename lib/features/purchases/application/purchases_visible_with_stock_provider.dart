import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_controller.dart';

final purchasesVisibleWithStockProvider = Provider<List<PurchaseModel>>((ref) {
  final purchases = ref.watch(purchasesWithStockProvider);
  final ui = ref.watch(purchasesUiControllerProvider);

  final query = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final filterSource = filter.sourceContains?.trim().toLowerCase() ?? '';
  final filterCurrency = filter.currency?.trim().toUpperCase() ?? '';

  // ОПТИМІЗАЦІЯ: Всі умови в одному циклі
  var items = purchases.where((item) {
    if (query.isNotEmpty) {
      final matchesQuery = item.itemId.toLowerCase().contains(query) ||
          item.source.toLowerCase().contains(query) ||
          (item.sellerName ?? '').toLowerCase().contains(query);
      if (!matchesQuery) return false;
    }

    if (filterSource.isNotEmpty && !item.source.toLowerCase().contains(filterSource)) {
      return false;
    }

    if (filterCurrency.isNotEmpty && item.currency.toUpperCase() != filterCurrency) {
      return false;
    }

    if (filter.minTotal != null && item.finalTotal < filter.minTotal!) return false;
    if (filter.maxTotal != null && item.finalTotal > filter.maxTotal!) return false;

    return true;
  }).toList();

  switch (ui.sort) {
    case PurchasesSortOption.newest:
      items.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate));
      break;
    case PurchasesSortOption.oldest:
      items.sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate));
      break;
    case PurchasesSortOption.totalHighToLow:
      items.sort((a, b) => b.finalTotal.compareTo(a.finalTotal));
      break;
    case PurchasesSortOption.totalLowToHigh:
      items.sort((a, b) => a.finalTotal.compareTo(b.finalTotal));
      break;
    case PurchasesSortOption.sourceAsc:
      items.sort((a, b) => a.source.toLowerCase().compareTo(b.source.toLowerCase()));
      break;
  }

  return items;
});