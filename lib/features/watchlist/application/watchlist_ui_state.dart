import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistUiState {
  final String query;
  final WatchlistSortOption sort;
  final WatchlistFilterModel filter;

  const WatchlistUiState({
    required this.query,
    required this.sort,
    required this.filter,
  });

  factory WatchlistUiState.initial() {
    return const WatchlistUiState(
      query: '',
      sort: WatchlistSortOption.newest,
      filter: WatchlistFilterModel.empty,
    );
  }

  WatchlistUiState copyWith({
    String? query,
    WatchlistSortOption? sort,
    WatchlistFilterModel? filter,
  }) {
    return WatchlistUiState(
      query: query ?? this.query,
      sort: sort ?? this.sort,
      filter: filter ?? this.filter,
    );
  }
}