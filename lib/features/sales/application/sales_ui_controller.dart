import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_filter_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';
import 'package:lego_trading_manager/features/sales/application/sales_ui_state.dart';

class SalesUiController extends Notifier<SalesUiState> {
  @override
  SalesUiState build() {
    return SalesUiState.initial();
  }

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(SalesSortOption value) {
    state = state.copyWith(sort: value);
  }

  void setFilter(SalesFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = SalesUiState.initial();
  }
}

final salesUiControllerProvider =
    NotifierProvider<SalesUiController, SalesUiState>(
  SalesUiController.new,
);