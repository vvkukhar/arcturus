import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistAutoTriggerCandidatesProvider =
    Provider<List<WatchlistItemModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final result = items.where((item) {
    if (!item.isActive) return false;

    final market = item.marketPrice;
    if (market == null) return false;

    return market <= item.maxBuyPrice;
  }).toList();

  result.sort((a, b) {
    final aMarket = a.marketPrice ?? double.infinity;
    final bMarket = b.marketPrice ?? double.infinity;
    return aMarket.compareTo(bMarket);
  });

  return result;
});