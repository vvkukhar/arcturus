import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistReviewQueueProvider = Provider<List<WatchlistItemModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final result = items
      .where((e) => e.isActive)
      .where((e) => e.marketPrice != null)
      .where((e) => e.marketPrice! <= e.maxBuyPrice)
      .toList();

  result.sort((a, b) => a.marketPrice!.compareTo(b.marketPrice!));
  return result.take(10).toList();
});