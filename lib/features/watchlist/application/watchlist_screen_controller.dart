import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_screen_state.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistScreenController extends StateNotifier<WatchlistScreenState> {
  WatchlistScreenController() : super(WatchlistScreenState.initial());

  void hydrate(List<WatchlistItemModel> items) {
    state = state.copyWith(allItems: items);
    _rebuild();
  }

  void search(String value) {
    state = state.copyWith(query: value);
    _rebuild();
  }

  void setFilter(WatchlistFilterModel filter) {
    state = state.copyWith(filter: filter);
    _rebuild();
  }

  void clearFilters() {
    state = state.copyWith(filter: WatchlistFilterModel.empty);
    _rebuild();
  }

  void setSort(WatchlistSortOption sort) {
    state = state.copyWith(sort: sort);
    _rebuild();
  }

  void toggleSelected(String id) {
    final next = {...state.selectedIds};

    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }

    state = state.copyWith(selectedIds: next);
  }

  void selectAllVisible() {
    state = state.copyWith(
      selectedIds: state.visibleItems.map((e) => e.id).toSet(),
    );
  }

  void clearSelection() {
    state = state.copyWith(selectedIds: {});
  }

  void _rebuild() {
    var items = [...state.allItems];

    final query = state.query.trim().toLowerCase();

    if (query.isNotEmpty) {
      items = items.where((item) {
        return item.title.toLowerCase().contains(query) ||
            (item.theme ?? '').toLowerCase().contains(query) ||
            (item.refId ?? '').toLowerCase().contains(query) ||
            (item.comment ?? '').toLowerCase().contains(query);
      }).toList();
    }

    final filter = state.filter;

    if (filter.activeOnly) {
      items = items.where((item) => item.isActive).toList();
    }

    if (filter.targetHitOnly) {
      items = items.where((item) {
        final market = item.marketPrice;
        return market != null && market <= item.desiredBuyPrice;
      }).toList();
    }

    if (filter.underMaxOnly) {
      items = items.where((item) {
        final market = item.marketPrice;
        return market != null && market <= item.maxBuyPrice;
      }).toList();
    }

    final theme = filter.themeContains?.trim().toLowerCase();
    if (theme != null && theme.isNotEmpty) {
      items = items.where((item) {
        return (item.theme ?? '').toLowerCase().contains(theme);
      }).toList();
    }

    switch (state.sort) {
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

    final validSelectedIds = state.selectedIds
        .where((id) => items.any((item) => item.id == id))
        .toSet();

    state = state.copyWith(
      visibleItems: items,
      selectedIds: validSelectedIds,
    );
  }
}

final watchlistScreenControllerProvider =
    StateNotifierProvider<WatchlistScreenController, WatchlistScreenState>(
  (ref) {
    final controller = WatchlistScreenController();

    ref.listen(
      watchlistControllerProvider.select((state) => state.allItems),
      (_, next) => controller.hydrate(next),
      fireImmediately: true,
    );

    return controller;
  },
);