import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';
import 'package:lego_trading_manager/features/partout/application/partout_ui_state.dart';

class PartOutUiController extends Notifier<PartOutUiState> {
  @override
  PartOutUiState build() {
    return PartOutUiState.initial();
  }

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(PartOutSortOption value) {
    state = state.copyWith(sortOption: value);
  }

  void setFilter(PartOutFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = PartOutUiState.initial();
  }
}

final partOutUiControllerProvider =
    NotifierProvider<PartOutUiController, PartOutUiState>(
  PartOutUiController.new,
);