import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_state.dart';

class InventoryUiController extends StateNotifier<InventoryUiState> {
  InventoryUiController() : super(InventoryUiState.initial());

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(InventorySortOption value) {
    state = state.copyWith(sort: value);
  }

  void setFilter(InventoryFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = InventoryUiState.initial();
  }
}

final inventoryUiControllerProvider =
    StateNotifierProvider<InventoryUiController, InventoryUiState>(
  (ref) => InventoryUiController(),
);