import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistScreenState {
  final String query;
  final WatchlistFilterModel filter;
  final WatchlistSortOption sort;
  final Set<String> selectedIds;
  final List<WatchlistItemModel> allItems;
  final List<WatchlistItemModel> visibleItems;

  const WatchlistScreenState({
    required this.query,
    required this.filter,
    required this.sort,
    required this.selectedIds,
    required this.allItems,
    required this.visibleItems,
  });

  factory WatchlistScreenState.initial() {
    return const WatchlistScreenState(
      query: '',
      filter: WatchlistFilterModel.empty,
      sort: WatchlistSortOption.newest,
      selectedIds: {},
      allItems: [],
      visibleItems: [],
    );
  }

  WatchlistScreenState copyWith({
    String? query,
    WatchlistFilterModel? filter,
    WatchlistSortOption? sort,
    Set<String>? selectedIds,
    List<WatchlistItemModel>? allItems,
    List<WatchlistItemModel>? visibleItems,
  }) {
    return WatchlistScreenState(
      query: query ?? this.query,
      filter: filter ?? this.filter,
      sort: sort ?? this.sort,
      selectedIds: selectedIds ?? this.selectedIds,
      allItems: allItems ?? this.allItems,
      visibleItems: visibleItems ?? this.visibleItems,
    );
  }
}