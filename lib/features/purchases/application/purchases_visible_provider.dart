import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_controller.dart';

final purchasesVisibleProvider = Provider<List<PurchaseModel>>((ref) {
  final items = ref.watch(purchasesControllerProvider);
  final ui = ref.watch(purchasesUiControllerProvider);

  final query = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final filterSource = filter.sourceContains?.trim().toLowerCase() ?? '';
  final filterCurrency = filter.currency?.trim().toUpperCase() ?? '';

  // ОПТИМІЗАЦІЯ: Робимо лише ОДИН прохід по масиву (O(N)), замість каскаду з 4-5 where() 
  var filteredItems = items.where((item) {
    // 1. Перевірка пошуку
    if (query.isNotEmpty) {
      final matchesQuery = item.source.toLowerCase().contains(query) ||
          item.itemId.toLowerCase().contains(query) ||
          (item.sellerName ?? '').toLowerCase().contains(query) ||
          (item.note ?? '').toLowerCase().contains(query);
      if (!matchesQuery) return false;
    }

    // 2. Перевірка фільтрів
    if (filterSource.isNotEmpty && !item.source.toLowerCase().contains(filterSource)) {
      return false;
    }
    if (filterCurrency.isNotEmpty && item.currency.toUpperCase() != filterCurrency) {
      return false;
    }
    if (filter.minTotal != null && item.finalTotal < filter.minTotal!) {
      return false;
    }
    if (filter.maxTotal != null && item.finalTotal > filter.maxTotal!) {
      return false;
    }

    return true; // Якщо пройшов усі перевірки — залишаємо
  }).toList();

  // Сортування
  switch (ui.sort) {
    case PurchasesSortOption.newest:
      filteredItems.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate));
      break;
    case PurchasesSortOption.oldest:
      filteredItems.sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate));
      break;
    case PurchasesSortOption.totalHighToLow:
      filteredItems.sort((a, b) => b.finalTotal.compareTo(a.finalTotal));
      break;
    case PurchasesSortOption.totalLowToHigh:
      filteredItems.sort((a, b) => a.finalTotal.compareTo(b.finalTotal));
      break;
    case PurchasesSortOption.sourceAsc:
      filteredItems.sort(
        (a, b) => a.source.toLowerCase().compareTo(b.source.toLowerCase()),
      );
      break;
  }

  return filteredItems;
});