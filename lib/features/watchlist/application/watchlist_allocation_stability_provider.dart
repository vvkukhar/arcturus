import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_durability_provider.dart';

class WatchlistAllocationStabilityModel {
  final double score;
  final String label;

  const WatchlistAllocationStabilityModel({
    required this.score,
    required this.label,
  });
}

final watchlistAllocationStabilityProvider =
    Provider<WatchlistAllocationStabilityModel>((ref) {
  final capital = ref.watch(watchlistCapitalDisciplineProvider);
  final durability = ref.watch(watchlistCommitDurabilityProvider);

  double capitalScore = 0;
  if (capital.ratio <= 0.7) {
    capitalScore = 90;
  } else if (capital.ratio <= 1.0) {
    capitalScore = 75;
  } else if (capital.ratio <= 1.2) {
    capitalScore = 50;
  } else {
    capitalScore = 20;
  }

  final score = (capitalScore * 0.5) + (durability.score * 0.5);

  final label = score >= 75
      ? 'stable allocation'
      : score >= 50
          ? 'moderately stable allocation'
          : 'unstable allocation';

  return WatchlistAllocationStabilityModel(
    score: score,
    label: label,
  );
});