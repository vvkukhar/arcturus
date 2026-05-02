import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryState {
  final List<ItemModel> allItems;
  final List<ItemModel> visibleItems;
  final String query;
  final InventoryFilterModel filter;
  final InventorySortOption sortOption;

  const InventoryState({
    required this.allItems,
    required this.visibleItems,
    required this.query,
    required this.filter,
    required this.sortOption,
  });

  factory InventoryState.initial() {
    return const InventoryState(
      allItems: [],
      visibleItems: [],
      query: '',
      filter: InventoryFilterModel.empty,
      sortOption: InventorySortOption.newest,
    );
  }

  InventoryState copyWith({
    List<ItemModel>? allItems,
    List<ItemModel>? visibleItems,
    String? query,
    InventoryFilterModel? filter,
    InventorySortOption? sortOption,
  }) {
    return InventoryState(
      allItems: allItems ?? this.allItems,
      visibleItems: visibleItems ?? this.visibleItems,
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}
