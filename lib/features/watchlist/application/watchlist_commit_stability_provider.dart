import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_model.dart';

final watchlistCommitStabilityProvider =
    Provider<WatchlistCommitStabilityModel>((ref) {
  const score = 72.0;

  final label = score >= 75
      ? 'stable commit'
      : score >= 50
          ? 'partial commit stability'
          : 'unstable commit';

  return const WatchlistCommitStabilityModel(
    score: score,
    label: label,
  );
});