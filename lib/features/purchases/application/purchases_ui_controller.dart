import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_state.dart';

class PurchasesUiController extends StateNotifier<PurchasesUiState> {
  PurchasesUiController() : super(PurchasesUiState.initial());

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(PurchasesSortOption value) {
    state = state.copyWith(sort: value);
  }

  void setFilter(PurchasesFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = PurchasesUiState.initial();
  }
}

final purchasesUiControllerProvider =
    StateNotifierProvider<PurchasesUiController, PurchasesUiState>((ref) {
  return PurchasesUiController();
});