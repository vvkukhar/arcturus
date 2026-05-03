import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_show_archived_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_controller.dart';

final inventoryVisibleItemsProvider = Provider<List<ItemModel>>((ref) {
  final allItems = ref.watch(inventoryControllerProvider).allItems;
  final ui = ref.watch(inventoryUiControllerProvider);
  final showArchived = ref.watch(inventoryShowArchivedProvider);

  final q = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final themeQ = filter.themeContains?.trim().toLowerCase() ?? '';

  var result = allItems.where((item) {
    if (!showArchived && item.status == ItemStatus.archived) return false;

    if (q.isNotEmpty) {
      final matchesQuery = item.title.toLowerCase().contains(q) ||
          (item.theme ?? '').toLowerCase().contains(q) ||
          (item.subtheme ?? '').toLowerCase().contains(q) ||
          (item.legoNumber ?? '').toLowerCase().contains(q) ||
          (item.minifigId ?? '').toLowerCase().contains(q) ||
          (item.notes ?? '').toLowerCase().contains(q) ||
          item.tags.any((tag) => tag.toLowerCase().contains(q));
      if (!matchesQuery) return false;
    }

    if (filter.status != null && item.status != filter.status) return false;
    if (filter.trackedOnly && !item.isTracked) return false;
    if (themeQ.isNotEmpty && !(item.theme ?? '').toLowerCase().contains(themeQ)) return false;

    return true;
  }).toList();

  switch (ui.sort) {
    case InventorySortOption.newest:
      result.sort((a, b) => (b.purchaseDate ?? DateTime(2000)).compareTo(a.purchaseDate ?? DateTime(2000)));
      break;
    case InventorySortOption.oldest:
      result.sort((a, b) => (a.purchaseDate ?? DateTime(2000)).compareTo(b.purchaseDate ?? DateTime(2000)));
      break;
    case InventorySortOption.titleAsc:
      result.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
      break;
    case InventorySortOption.costHighToLow:
      result.sort((a, b) => b.totalCost.compareTo(a.totalCost));
      break;
    case InventorySortOption.costLowToHigh:
      result.sort((a, b) => a.totalCost.compareTo(b.totalCost));
      break;
    case InventorySortOption.expectedProfitHighToLow:
      result.sort((a, b) => ((b.expectedSalePrice ?? 0) - b.totalCost).compareTo((a.expectedSalePrice ?? 0) - a.totalCost));
      break;
    case InventorySortOption.daysInInventoryHighToLow:
      result.sort((a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0));
      break;
  }

  return result;
});