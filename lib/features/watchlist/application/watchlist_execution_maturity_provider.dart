import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_maturity_model.dart';

final watchlistExecutionMaturityProvider =
    Provider<WatchlistExecutionMaturityModel>((ref) {
  final stability = ref.watch(watchlistCommitStabilityProvider);
  final discipline = ref.watch(watchlistExecutionDisciplineProvider);

  final score = (stability.score * 0.5) + (discipline.score * 0.5);

  final label = score >= 75
      ? 'high execution maturity'
      : score >= 50
          ? 'moderate execution maturity'
          : 'low execution maturity';

  return WatchlistExecutionMaturityModel(
    score: score,
    label: label,
  );
});