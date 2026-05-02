import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_readiness_score_model.dart';

final watchlistQueueReadinessScoreProvider =
    Provider<WatchlistQueueReadinessScoreModel>((ref) {
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);
  final pressure = ref.watch(watchlistQueuePressureProvider);

  double score = 0;

  if (actionable.selectedCount > 0) score += 40;
  if (actionable.selectedGap > 0) score += 35;

  if (pressure.label == 'light' || pressure.label == 'healthy') {
    score += 25;
  } else if (pressure.label == 'tight') {
    score += 10;
  }

  final label = score >= 80
      ? 'ready'
      : score >= 50
          ? 'partial'
          : 'weak';

  return WatchlistQueueReadinessScoreModel(
    score: score,
    label: label,
  );
});