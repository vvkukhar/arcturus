import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_action_confidence_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_pressure_summary_provider.dart';

final watchlistQueueActionConfidenceProvider =
    Provider<WatchlistQueueActionConfidenceModel>((ref) {
  final pressure = ref.watch(watchlistQueueExecutionPressureSummaryProvider);
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);

  double score = 0;

  if (actionable.selectedCount > 0) score += 40;
  if (actionable.selectedGap > 0) score += 30;

  if (pressure.pressure == 'light' || pressure.pressure == 'healthy') {
    score += 30;
  } else if (pressure.pressure == 'tight') {
    score += 15;
  }

  final label = score >= 80
      ? 'high confidence'
      : score >= 55
          ? 'medium confidence'
          : 'low confidence';

  return WatchlistQueueActionConfidenceModel(
    score: score,
    label: label,
  );
});