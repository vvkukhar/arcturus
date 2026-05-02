import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryUiState {
  final String query;
  final InventorySortOption sort;
  final InventoryFilterModel filter;

  const InventoryUiState({
    required this.query,
    required this.sort,
    required this.filter,
  });

  factory InventoryUiState.initial() {
    return const InventoryUiState(
      query: '',
      sort: InventorySortOption.newest,
      filter: InventoryFilterModel.empty,
    );
  }

  InventoryUiState copyWith({
    String? query,
    InventorySortOption? sort,
    InventoryFilterModel? filter,
  }) {
    return InventoryUiState(
      query: query ?? this.query,
      sort: sort ?? this.sort,
      filter: filter ?? this.filter,
    );
  }
}
