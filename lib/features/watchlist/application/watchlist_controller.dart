import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_state.dart';

class WatchlistController extends StateNotifier<WatchlistState> {
  final WatchlistRepository repository;

  WatchlistController(this.repository) : super(WatchlistState.initial()) {
    load();
  }

  void load() {
    final items = repository.getAll();
    _rebuildState(allItems: items);
  }

  void search(String query) {
    _rebuildState(query: query);
  }

  void setFilter(WatchlistFilterModel filter) {
    _rebuildState(filter: filter);
  }

  void setSort(WatchlistSortOption sortOption) {
    _rebuildState(sortOption: sortOption);
  }

  void clearFilters() {
    _rebuildState(
      query: '',
      filter: WatchlistFilterModel.empty,
    );
  }

  void addItem(WatchlistItemModel item) {
    repository.add(item);
    load();
  }

  void updateItem(WatchlistItemModel item) {
    repository.update(item);
    load();
  }

  void deleteItem(String id) {
    repository.delete(id);
    load();
  }

  WatchlistItemModel? getById(String id) {
    for (final item in state.allItems) {
      if (item.id == id) return item;
    }
    return null;
  }

  void deactivate(String id) {
    final current = getById(id);
    if (current == null) return;
    repository.update(current.copyWith(isActive: false));
    load();
  }

  void activate(String id) {
    final current = getById(id);
    if (current == null) return;
    repository.update(current.copyWith(isActive: true));
    load();
  }

  void _rebuildState({
    List<WatchlistItemModel>? allItems,
    String? query,
    WatchlistFilterModel? filter,
    WatchlistSortOption? sortOption,
  }) {
    final nextAllItems = allItems ?? state.allItems;
    final nextQuery = query ?? state.query;
    final nextFilter = filter ?? state.filter;
    final nextSort = sortOption ?? state.sortOption;

    var items = [...nextAllItems];

    final normalizedQuery = nextQuery.trim().toLowerCase();
    if (normalizedQuery.isNotEmpty) {
      items = items.where((item) {
        return item.title.toLowerCase().contains(normalizedQuery) ||
            (item.theme ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.refId ?? '').toLowerCase().contains(normalizedQuery) ||
            (item.comment ?? '').toLowerCase().contains(normalizedQuery);
      }).toList();
    }

    if (nextFilter.activeOnly) {
      items = items.where((item) => item.isActive).toList();
    }

    if (nextFilter.targetHitOnly) {
      items = items.where((item) {
        final market = item.marketPrice;
        if (market == null) return false;
        return market <= item.desiredBuyPrice;
      }).toList();
    }

    if (nextFilter.underMaxOnly) {
      items = items.where((item) {
        final market = item.marketPrice;
        if (market == null) return false;
        return market <= item.maxBuyPrice;
      }).toList();
    }

    if ((nextFilter.themeContains ?? '').trim().isNotEmpty) {
      final theme = nextFilter.themeContains!.trim().toLowerCase();
      items = items.where((item) {
        return (item.theme ?? '').toLowerCase().contains(theme);
      }).toList();
    }

    switch (nextSort) {
      case WatchlistSortOption.newest:
        items.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case WatchlistSortOption.oldest:
        items.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        break;
      case WatchlistSortOption.titleAsc:
        items.sort(
          (a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()),
        );
        break;
      case WatchlistSortOption.desiredLowToHigh:
        items.sort((a, b) => a.desiredBuyPrice.compareTo(b.desiredBuyPrice));
        break;
      case WatchlistSortOption.desiredHighToLow:
        items.sort((a, b) => b.desiredBuyPrice.compareTo(a.desiredBuyPrice));
        break;
      case WatchlistSortOption.marketLowToHigh:
        items.sort(
          (a, b) => (a.marketPrice ?? double.infinity)
              .compareTo(b.marketPrice ?? double.infinity),
        );
        break;
      case WatchlistSortOption.marketHighToLow:
        items.sort(
          (a, b) => (b.marketPrice ?? -1).compareTo(a.marketPrice ?? -1),
        );
        break;
    }

    state = state.copyWith(
      allItems: nextAllItems,
      visibleItems: items,
      query: nextQuery,
      filter: nextFilter,
      sortOption: nextSort,
    );
  }
}

final watchlistControllerProvider =
    StateNotifierProvider<WatchlistController, WatchlistState>((ref) {
  return WatchlistController(ref.read(watchlistRepositoryProvider));
});