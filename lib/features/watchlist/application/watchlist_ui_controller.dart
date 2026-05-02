import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_ui_state.dart';

class WatchlistUiController extends StateNotifier<WatchlistUiState> {
  WatchlistUiController() : super(WatchlistUiState.initial());

  void search(String value) {
    state = state.copyWith(query: value);
  }

  void setSort(WatchlistSortOption value) {
    state = state.copyWith(sort: value);
  }

  void setFilter(WatchlistFilterModel value) {
    state = state.copyWith(filter: value);
  }

  void clearAll() {
    state = WatchlistUiState.initial();
  }
}

final watchlistUiControllerProvider =
    StateNotifierProvider<WatchlistUiController, WatchlistUiState>(
  (ref) => WatchlistUiController(),
);