// lib/features/market/application/market_ui_controller.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';
import 'package:lego_trading_manager/features/market/application/market_ui_state.dart';

class MarketUiController extends StateNotifier<MarketUiState> {
  MarketUiController() : super(MarketUiState.initial());

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(MarketSortOption value) {
    state = state.copyWith(sortOption: value);
  }

  void setFilter(MarketFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = MarketUiState.initial();
  }
}

final marketUiControllerProvider =
    StateNotifierProvider<MarketUiController, MarketUiState>(
  (ref) => MarketUiController(),
);
