import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_state.dart';

class InventoryController extends Notifier<InventoryState> {
  InventoryRepository get _repository => ref.read(inventoryRepositoryProvider);

  @override
  InventoryState build() {
    Future.microtask(() => loadItems());
    return InventoryState.initial();
  }

  void loadItems() {
    final items = _repository.getAllItems();
    _rebuildState(allItems: items);
  }

  void search(String query) => _rebuildState(query: query);
  
  void setSort(InventorySortOption sortOption) => _rebuildState(sortOption: sortOption);
  
  void setFilter(InventoryFilterModel filter) => _rebuildState(filter: filter);
  
  void clearFilters() => _rebuildState(filter: InventoryFilterModel.empty, query: '');

  Future<void> addItem(ItemModel item) async {
    await _repository.addItem(item);
    loadItems();
  }

  Future<void> updateItem(ItemModel item) async {
    await _repository.updateItem(item);
    loadItems();
  }

  Future<void> deleteItem(String id) async {
    await _repository.deleteItem(id);
    loadItems();
  }

  ItemModel? getById(String id) {
    return _repository.getById(id);
  }

  void _rebuildState({
    List<ItemModel>? allItems,
    String? query,
    InventoryFilterModel? filter,
    InventorySortOption? sortOption,
  }) {
    final nextAllItems = allItems ?? state.allItems;
    final nextQuery = (query ?? state.query).trim().toLowerCase();
    final nextFilter = filter ?? state.filter;
    final nextSort = sortOption ?? state.sortOption;

    final themeQ = nextFilter.themeContains?.trim().toLowerCase() ?? '';

    var items = nextAllItems.where((item) {
      if (nextQuery.isNotEmpty) {
        final matchesQuery = item.title.toLowerCase().contains(nextQuery) ||
            (item.theme ?? '').toLowerCase().contains(nextQuery) ||
            (item.subtheme ?? '').toLowerCase().contains(nextQuery) ||
            (item.legoNumber ?? '').toLowerCase().contains(nextQuery) ||
            (item.minifigId ?? '').toLowerCase().contains(nextQuery) ||
            (item.notes ?? '').toLowerCase().contains(nextQuery) ||
            item.tags.any((tag) => tag.toString().toLowerCase().contains(nextQuery));
        if (!matchesQuery) return false;
      }

      if (nextFilter.status != null && item.status != nextFilter.status) return false;
      if (nextFilter.trackedOnly && !item.isTracked) return false;
      if (themeQ.isNotEmpty && !(item.theme ?? '').toLowerCase().contains(themeQ)) return false;

      return true;
    }).toList();

    switch (nextSort) {
      case InventorySortOption.newest:
        items.sort((a, b) => (b.purchaseDate ?? DateTime(2000)).compareTo(a.purchaseDate ?? DateTime(2000)));
        break;
      case InventorySortOption.oldest:
        items.sort((a, b) => (a.purchaseDate ?? DateTime(2000)).compareTo(b.purchaseDate ?? DateTime(2000)));
        break;
      case InventorySortOption.titleAsc:
        items.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
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
        items.sort((a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0));
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

final inventoryControllerProvider = NotifierProvider<InventoryController, InventoryState>(
  InventoryController.new,
);