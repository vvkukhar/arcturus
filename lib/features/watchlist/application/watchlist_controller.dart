import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_state.dart';

class WatchlistController extends Notifier<WatchlistState> {
  @override
  WatchlistState build() {
    Future.microtask(() => load());
    return WatchlistState.initial();
  }

  void load() {
    final items = ref.read(watchlistRepositoryProvider).getAll();
    _rebuildState(allItems: items);
  }

  void search(String query) => _rebuildState(query: query);
  void setFilter(WatchlistFilterModel filter) => _rebuildState(filter: filter);
  void setSort(WatchlistSortOption sortOption) => _rebuildState(sortOption: sortOption);
  void clearFilters() => _rebuildState(query: '', filter: WatchlistFilterModel.empty);

  void addItem(WatchlistItemModel item) {
    ref.read(watchlistRepositoryProvider).add(item);
    load();
  }

  void updateItem(WatchlistItemModel item) {
    ref.read(watchlistRepositoryProvider).update(item);
    load();
  }

  void deleteItem(String id) {
    ref.read(watchlistRepositoryProvider).delete(id);
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
    updateItem(current.copyWith(isActive: false));
  }

  void activate(String id) {
    final current = getById(id);
    if (current == null) return;
    updateItem(current.copyWith(isActive: true));
  }

  void activateMany(Set<String> ids) {
    for (final id in ids) {
      activate(id);
    }
  }

  void deactivateMany(Set<String> ids) {
    for (final id in ids) {
      deactivate(id);
    }
  }

  void deleteMany(Set<String> ids) {
    for (final id in ids) {
      deleteItem(id);
    }
  }

  void _rebuildState({
    List<WatchlistItemModel>? allItems,
    String? query,
    WatchlistFilterModel? filter,
    WatchlistSortOption? sortOption,
  }) {
    final nextAllItems = allItems ?? state.allItems;
    final nextQuery = (query ?? state.query).trim().toLowerCase();
    final nextFilter = filter ?? state.filter;
    final nextSort = sortOption ?? state.sortOption;

    final themeQuery = nextFilter.themeContains?.trim().toLowerCase() ?? '';

    var items = nextAllItems.where((item) {
      if (nextQuery.isNotEmpty) {
        final matchesQuery = item.title.toLowerCase().contains(nextQuery) ||
            (item.theme ?? '').toLowerCase().contains(nextQuery) ||
            (item.refId ?? '').toLowerCase().contains(nextQuery) ||
            (item.comment ?? '').toLowerCase().contains(nextQuery);
        if (!matchesQuery) return false;
      }

      if (nextFilter.activeOnly && !item.isActive) return false;

      final market = item.marketPrice;
      if (nextFilter.targetHitOnly && (market == null || market > item.desiredBuyPrice)) return false;
      if (nextFilter.underMaxOnly && (market == null || market > item.maxBuyPrice)) return false;

      if (themeQuery.isNotEmpty && !(item.theme ?? '').toLowerCase().contains(themeQuery)) {
        return false;
      }

      return true;
    }).toList();

    switch (nextSort) {
      case WatchlistSortOption.newest:
        items.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case WatchlistSortOption.oldest:
        items.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        break;
      case WatchlistSortOption.titleAsc:
        items.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
        break;
      case WatchlistSortOption.desiredLowToHigh:
        items.sort((a, b) => a.desiredBuyPrice.compareTo(b.desiredBuyPrice));
        break;
      case WatchlistSortOption.desiredHighToLow:
        items.sort((a, b) => b.desiredBuyPrice.compareTo(a.desiredBuyPrice));
        break;
      case WatchlistSortOption.marketLowToHigh:
        items.sort((a, b) => (a.marketPrice ?? double.infinity).compareTo(b.marketPrice ?? double.infinity));
        break;
      case WatchlistSortOption.marketHighToLow:
        items.sort((a, b) => (b.marketPrice ?? -1).compareTo(a.marketPrice ?? -1));
        break;
    }

    state = state.copyWith(
      allItems: nextAllItems,
      visibleItems: items,
      query: query ?? state.query,
      filter: nextFilter,
      sortOption: nextSort,
    );
  }
}

final watchlistControllerProvider =
    NotifierProvider<WatchlistController, WatchlistState>(
  WatchlistController.new,
);