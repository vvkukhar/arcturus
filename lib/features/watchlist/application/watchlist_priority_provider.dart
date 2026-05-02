import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_model.dart';

final watchlistPriorityProvider = Provider<List<WatchlistPriorityModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final result = items.map((item) {
    final market = item.marketPrice ?? item.maxBuyPrice;
    final spread = item.maxBuyPrice - item.desiredBuyPrice;
    final valueGap = item.maxBuyPrice - market;
    final activeBoost = item.isActive ? 20.0 : 0.0;
    final score = valueGap + spread + activeBoost;

    String label;
    if (score >= 40) {
      label = 'high';
    } else if (score >= 15) {
      label = 'mid';
    } else {
      label = 'low';
    }

    return WatchlistPriorityModel(
      id: item.id,
      title: item.title,
      score: score,
      label: label,
    );
  }).toList();

  result.sort((a, b) => b.score.compareTo(a.score));
  return result;
});