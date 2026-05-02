import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_maturity_provider.dart';

class WatchlistCommitDurabilityModel {
  final double score;
  final String label;

  const WatchlistCommitDurabilityModel({
    required this.score,
    required this.label,
  });
}

final watchlistCommitDurabilityProvider =
    Provider<WatchlistCommitDurabilityModel>((ref) {
  final stability = ref.watch(watchlistCommitStabilityProvider);
  final maturity = ref.watch(watchlistExecutionMaturityProvider);

  final score = (stability.score * 0.55) + (maturity.score * 0.45);

  final label = score >= 75
      ? 'durable commit'
      : score >= 50
          ? 'moderately durable commit'
          : 'fragile commit';

  return WatchlistCommitDurabilityModel(
    score: score,
    label: label,
  );
});