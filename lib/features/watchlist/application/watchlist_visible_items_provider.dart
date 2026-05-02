import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistVisibleItemsProvider = Provider<List<WatchlistItemModel>>((ref) {
  return ref.watch(watchlistControllerProvider).visibleItems;
});