import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_ui_state.dart';

class WatchlistUiController extends Notifier<WatchlistUiState> {
  @override
  WatchlistUiState build() {
    return WatchlistUiState.initial();
  }

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
    NotifierProvider<WatchlistUiController, WatchlistUiState>(
  WatchlistUiController.new,
);