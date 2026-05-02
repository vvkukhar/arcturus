import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistOpportunitiesProvider =
    Provider<List<WatchlistItemModel>>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;

  return items.where((item) {
    final market = item.marketPrice;
    return item.isActive &&
        market != null &&
        market <= item.maxBuyPrice;
  }).toList();
});