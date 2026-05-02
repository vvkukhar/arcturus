import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_state.dart';

class InventoryController extends StateNotifier<InventoryState> {
  final InventoryRepository repository;

  InventoryController(this.repository) : super(InventoryState.initial()) {
    loadItems();
  }

  void loadItems() {
    final items = repository.getAllItems();
    _rebuildState(allItems: items);
  }

  void search(String query) {
    _rebuildState(query: query);
  }

  void setSort(InventorySortOption sortOption) {
    _rebuildState(sortOption: sortOption);
  }

  void setFilter(InventoryFilterModel filter) {
    _rebuildState(filter: filter);
  }

  void clearFilters() {
    _rebuildState(filter: InventoryFilterModel.empty, query: '');
  }

  void addItem(ItemModel item) {
    repository.addItem(item);
    loadItems();
  }

  void updateItem(ItemModel item) {
    repository.updateItem(item);
    loadItems();
  }

  void deleteItem(String id) {
    repository.deleteItem(id);
    loadItems();
  }

  ItemModel? getById(String id) {
    for (final item in state.allItems) {
      if (item.id == id) return item;
    }
    return null;
  }

  void _rebuildState({
    List<ItemModel>? allItems,
    String? query,
    InventoryFilterModel? filter,
    InventorySortOption? sortOption,
  }) {
    final nextAllItems = allItems ?? state.allItems;
    final nextQuery = query ?? state.query;
    final nextFilter = filter ?? state.filter;
    final nextSort = sortOption ?? state.sortOption;

    var items = [...nextAllItems];

    final normalizedQuery = nextQuery.trim().toLowerCase();
    if (normalizedQuery.isNotEmpty) {
      items = items.where((item) {
        return item.title.toLowerCase().contains(normalizedQuery) ||
            (item.theme ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.subtheme ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.legoNumber ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.minifigId ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.notes ?? '').toLowerCase().contains(normalizedQuery) ||
            item.tags.any(
              (tag) => tag.toString().toLowerCase().contains(normalizedQuery),
            );
      }).toList();
    }

    if (nextFilter.status != null) {
      items = items.where((item) => item.status == nextFilter.status).toList();
    }

    if (nextFilter.trackedOnly) {
      items = items.where((item) => item.isTracked).toList();
    }

    if ((nextFilter.themeContains ?? '').trim().isNotEmpty) {
      final theme = nextFilter.themeContains!.trim().toLowerCase();
      items = items
          .where((item) => (item.theme ?? '').toLowerCase().contains(theme))
          .toList();
    }

    switch (nextSort) {
      case InventorySortOption.newest:
        items.sort((a, b) {
          final aDate = a.purchaseDate ?? DateTime.fromMillisecondsSinceEpoch(0);
          final bDate = b.purchaseDate ?? DateTime.fromMillisecondsSinceEpoch(0);
          return bDate.compareTo(aDate);
        });
        break;
      case InventorySortOption.oldest:
        items.sort((a, b) {
          final aDate = a.purchaseDate ?? DateTime.fromMillisecondsSinceEpoch(0);
          final bDate = b.purchaseDate ?? DateTime.fromMillisecondsSinceEpoch(0);
          return aDate.compareTo(bDate);
        });
        break;
      case InventorySortOption.titleAsc:
        items.sort(
          (a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()),
        );
        break;
      case InventorySortOption.costHighToLow:
        items.sort((a, b) => b.totalCost.compareTo(a.totalCost));
        break;
      case InventorySortOption.costLowToHigh:
        items.sort((a, b) => a.totalCost.compareTo(b.totalCost));
        break;
      case InventorySortOption.expectedProfitHighToLow:
        items.sort((a, b) {
          final aProfit = (a.expectedSalePrice ?? 0) - a.totalCost;
          final bProfit = (b.expectedSalePrice ?? 0) - b.totalCost;
          return bProfit.compareTo(aProfit);
        });
        break;
      case InventorySortOption.daysInInventoryHighToLow:
        items.sort(
          (a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0),
        );
        break;
    }

    state = state.copyWith(
      allItems: nextAllItems,
      visibleItems: items,
      query: nextQuery,
      filter: nextFilter,
      sortOption: nextSort,
    );
  }
}

final inventoryControllerProvider =
    StateNotifierProvider<InventoryController, InventoryState>((ref) {
  return InventoryController(ref.read(inventoryRepositoryProvider));
});