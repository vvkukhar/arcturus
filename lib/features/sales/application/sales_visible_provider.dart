import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';
import 'package:lego_trading_manager/features/sales/application/sales_ui_controller.dart';

final salesVisibleProvider = Provider<List<SaleModel>>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final ui = ref.watch(salesUiControllerProvider);

  final query = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final platformContains = filter.platformContains?.trim().toLowerCase() ?? '';
  final buyerContains = filter.buyerContains?.trim().toLowerCase() ?? '';

  // ОПТИМІЗАЦІЯ: Один прохід замість каскаду where()
  var items = sales.where((item) {
    if (query.isNotEmpty) {
      final matchesQuery = item.itemId.toLowerCase().contains(query) ||
          item.platform.toLowerCase().contains(query) ||
          (item.buyerName ?? '').toLowerCase().contains(query);
      if (!matchesQuery) return false;
    }

    if (platformContains.isNotEmpty && !item.platform.toLowerCase().contains(platformContains)) {
      return false;
    }

    if (buyerContains.isNotEmpty && !(item.buyerName ?? '').toLowerCase().contains(buyerContains)) {
      return false;
    }

    if (filter.minNet != null && item.finalNet < filter.minNet!) return false;
    if (filter.maxNet != null && item.finalNet > filter.maxNet!) return false;

    return true;
  }).toList();

  switch (ui.sort) {
    case SalesSortOption.newest:
      items.sort((a, b) => b.saleDate.compareTo(a.saleDate));
      break;
    case SalesSortOption.oldest:
      items.sort((a, b) => a.saleDate.compareTo(b.saleDate));
      break;
    case SalesSortOption.finalNetHighToLow:
      items.sort((a, b) => b.finalNet.compareTo(a.finalNet));
      break;
    case SalesSortOption.finalNetLowToHigh:
      items.sort((a, b) => a.finalNet.compareTo(b.finalNet));
      break;
    case SalesSortOption.platformAsc:
      items.sort(
        (a, b) => a.platform.toLowerCase().compareTo(b.platform.toLowerCase()),
      );
      break;
  }

  return items;
});