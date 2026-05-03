import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_filter_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_state.dart';

// Теж переводимо на Notifier
class PurchasesUiController extends Notifier<PurchasesUiState> {
  
  @override
  PurchasesUiState build() {
    return PurchasesUiState.initial();
  }

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
    NotifierProvider<PurchasesUiController, PurchasesUiState>(
  PurchasesUiController.new,
);