import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_buy_decision_provider.dart';

class WatchlistTopBuyCandidateModel {
  final String id;
  final String title;
  final double score;
  final String reason;

  const WatchlistTopBuyCandidateModel({
    required this.id,
    required this.title,
    required this.score,
    required this.reason,
  });
}

final watchlistTopBuyCandidatesProvider =
    Provider<List<WatchlistTopBuyCandidateModel>>((ref) {
  final decisions = ref.watch(watchlistBuyDecisionProvider);

  final result = decisions
      .where((e) => e.decision == 'buy')
      .map(
        (e) => WatchlistTopBuyCandidateModel(
          id: e.id,
          title: e.title,
          score: e.score,
          reason: e.reason,
        ),
      )
      .toList();

  result.sort((a, b) => b.score.compareTo(a.score));
  return result.take(10).toList();
});