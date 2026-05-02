import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_smart_rank_model.dart';

final watchlistSmartRankProvider =
    Provider<List<WatchlistSmartRankModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final ranked = items.map((item) {
    final market = item.marketPrice ?? item.maxBuyPrice;
    final spread = item.maxBuyPrice - item.desiredBuyPrice;
    final valueGap = item.maxBuyPrice - market;
    final activeBoost = item.isActive ? 20.0 : 0.0;
    final score = spread + valueGap + activeBoost;

    return WatchlistSmartRankModel(
      id: item.id,
      title: item.title,
      score: score,
    );
  }).toList();

  ranked.sort((a, b) => b.score.compareTo(a.score));
  return ranked;
});