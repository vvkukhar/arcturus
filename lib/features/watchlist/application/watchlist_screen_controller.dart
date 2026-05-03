import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_screen_state.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistScreenController extends Notifier<WatchlistScreenState> {
  @override
  WatchlistScreenState build() {
    // Автоматично синхронізуємо зі спільним стейтом
    ref.listen(
      watchlistControllerProvider.select((s) => s.allItems),
      (_, next) => hydrate(next),
      fireImmediately: true,
    );
    return WatchlistScreenState.initial();
  }

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
    final query = state.query.trim().toLowerCase();
    final filter = state.filter;
    final themeQuery = filter.themeContains?.trim().toLowerCase() ?? '';

    // ОПТИМІЗАЦІЯ: Один прохід для screen контролера
    var items = state.allItems.where((item) {
      if (query.isNotEmpty) {
        final matchesQuery = item.title.toLowerCase().contains(query) ||
            (item.theme ?? '').toLowerCase().contains(query) ||
            (item.refId ?? '').toLowerCase().contains(query) ||
            (item.comment ?? '').toLowerCase().contains(query);
        if (!matchesQuery) return false;
      }

      if (filter.activeOnly && !item.isActive) return false;

      final market = item.marketPrice;
      if (filter.targetHitOnly && (market == null || market > item.desiredBuyPrice)) return false;
      if (filter.underMaxOnly && (market == null || market > item.maxBuyPrice)) return false;

      if (themeQuery.isNotEmpty && !(item.theme ?? '').toLowerCase().contains(themeQuery)) {
        return false;
      }

      return true;
    }).toList();

    switch (state.sort) {
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
    NotifierProvider<WatchlistScreenController, WatchlistScreenState>(
  WatchlistScreenController.new,
);