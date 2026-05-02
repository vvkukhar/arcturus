import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_selection_controller.dart';

final watchlistSelectedItemsProvider =
    Provider<List<WatchlistItemModel>>((ref) {
  final selectedIds = ref.watch(watchlistSelectionProvider);
  final allItems = ref.watch(watchlistControllerProvider).allItems;

  return allItems.where((item) => selectedIds.contains(item.id)).toList();
});