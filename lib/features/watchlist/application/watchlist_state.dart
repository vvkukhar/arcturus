import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistState {
  final List<WatchlistItemModel> allItems;
  final List<WatchlistItemModel> visibleItems;
  final String query;
  final WatchlistFilterModel filter;
  final WatchlistSortOption sortOption;

  const WatchlistState({
    required this.allItems,
    required this.visibleItems,
    required this.query,
    required this.filter,
    required this.sortOption,
  });

  factory WatchlistState.initial() {
    return const WatchlistState(
      allItems: [],
      visibleItems: [],
      query: '',
      filter: WatchlistFilterModel.empty,
      sortOption: WatchlistSortOption.newest,
    );
  }

  WatchlistState copyWith({
    List<WatchlistItemModel>? allItems,
    List<WatchlistItemModel>? visibleItems,
    String? query,
    WatchlistFilterModel? filter,
    WatchlistSortOption? sortOption,
  }) {
    return WatchlistState(
      allItems: allItems ?? this.allItems,
      visibleItems: visibleItems ?? this.visibleItems,
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}