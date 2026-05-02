import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_pressure_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';

final watchlistQueueExecutionPressureSummaryProvider =
    Provider<WatchlistQueueExecutionPressureSummaryModel>((ref) {
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);
  final pressureModel = ref.watch(watchlistQueuePressureProvider);

  final label = actionable.selectedCount == 0
      ? 'No queue selection active'
      : '${pressureModel.label} pressure on current queue selection';

  return WatchlistQueueExecutionPressureSummaryModel(
    selectedCount: actionable.selectedCount,
    pressure: pressureModel.label,
    label: label,
  );
});