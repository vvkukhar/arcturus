import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

class WatchlistBuyDecisionModel {
  final String id;
  final String title;
  final String decision;
  final String reason;
  final double score;

  const WatchlistBuyDecisionModel({
    required this.id,
    required this.title,
    required this.decision,
    required this.reason,
    required this.score,
  });

  bool get shouldBuy => decision == 'buy';
}

final watchlistBuyDecisionProvider =
    Provider<List<WatchlistBuyDecisionModel>>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  final result = items.map((item) {
    final market = item.marketPrice;
    final underDesired =
        market != null ? market <= item.desiredBuyPrice : false;
    final underMax = market != null ? market <= item.maxBuyPrice : false;

    String decision;
    String reason;
    double score;

    if (!item.isActive) {
      decision = 'ignore';
      reason = 'Item is inactive';
      score = 0;
    } else if (underDesired) {
      decision = 'buy';
      reason = 'Market is under desired price';
      score = 95;
    } else if (underMax) {
      decision = 'review';
      reason = 'Market is under max price';
      score = 75;
    } else if (market == null) {
      decision = 'wait';
      reason = 'No market price yet';
      score = 40;
    } else {
      decision = 'skip';
      reason = 'Market is above max price';
      score = 10;
    }

    return WatchlistBuyDecisionModel(
      id: item.id,
      title: item.title,
      decision: decision,
      reason: reason,
      score: score,
    );
  }).toList();

  result.sort((a, b) => b.score.compareTo(a.score));
  return result;
});