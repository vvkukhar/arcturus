import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistTopTargetsProvider = Provider<List<WatchlistItemModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final withMarket = items.where((item) => item.marketPrice != null).toList();

  withMarket.sort((a, b) {
    final aGap = (a.marketPrice ?? 0) - a.desiredBuyPrice;
    final bGap = (b.marketPrice ?? 0) - b.desiredBuyPrice;
    return aGap.compareTo(bGap);
  });

  return withMarket.take(8).toList();
});